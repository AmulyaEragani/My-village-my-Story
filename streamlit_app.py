# Streamlit app code will go here
# streamlit_app.py
# My Village, My Story — an open-source, culturally rich story collector
# Built with Streamlit. Saves submissions directly to a GitHub repo via the GitHub Contents API.
#
# ──────────────────────────────────────────────────────────────────────────────
# QUICK START
# 1) pip install -r requirements.txt  (streamlit, requests)
# 2) Add Streamlit secrets (see below) with your GitHub repo details + PAT.
# 3) Run: streamlit run streamlit_app.py
# 4) Deploy on Streamlit Community Cloud and paste the same secrets there.
#
# STREAMLIT SECRETS (in .streamlit/secrets.toml)
# [github]
# owner = "YOUR_GITHUB_USERNAME_OR_ORG"
# repo = "my-village-my-story"
# token = "ghp_your_personal_access_token_with_repo_scope"
# branch = "main"  # or "master"
#
# FOLDER STRUCTURE IN REPO
# data/<state>/<village>/<yyyy-mm-dd>/<uuid>/story.json
# plus any media files alongside story.json (images/audio/video).
# ──────────────────────────────────────────────────────────────────────────────

import base64
import datetime as dt
import io
import json
import re
import uuid
from typing import Dict, List, Tuple

import requests
import streamlit as st

# ──────────────────────────────────────────────────────────────────────────────
# Page setup
st.set_page_config(
    page_title="My Village, My Story",
    page_icon="📜",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Minimal local CSS for a clean, soft UI
CUSTOM_CSS = """
<style>
    .hero {
        background: radial-gradient(1200px 600px at 10% -10%, rgba(99,102,241,.15), transparent),
                    radial-gradient(1000px 500px at 110% 10%, rgba(16,185,129,.12), transparent);
        border-radius: 24px;
        padding: 28px 28px 18px 28px;
        border: 1px solid rgba(0,0,0,0.06);
    }
    .muted { color: rgba(0,0,0,0.6); }
    .chip { display:inline-block; padding:6px 10px; border-radius:999px; border:1px solid rgba(0,0,0,0.1); margin:2px; font-size:0.85rem; }
    .success-link a { text-decoration: none; }
    .caps { letter-spacing: .08em; font-weight: 600; font-size: .8rem; opacity: .8; }
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)

# ──────────────────────────────────────────────────────────────────────────────
# Helpers

def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[^a-z0-9\-\s]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text or "untitled"


def get_gh_cfg() -> Dict[str, str]:
    """Load GitHub config from Streamlit secrets and validate."""
    try:
        gh = st.secrets["github"]
        owner = gh.get("owner")
        repo = gh.get("repo")
        token = gh.get("token")
        branch = gh.get("branch", "main")
        if not all([owner, repo, token]):
            raise KeyError
        return {"owner": owner, "repo": repo, "token": token, "branch": branch}
    except Exception:
        st.error(
            "GitHub config missing. Please set [github] owner, repo, token (and optional branch) in secrets.")
        st.stop()


def gh_contents_url(owner: str, repo: str, path: str) -> str:
    return f"https://api.github.com/repos/{owner}/{repo}/contents/{path}"


def gh_get_sha_if_exists(owner: str, repo: str, path: str, token: str, ref: str) -> str:
    """Return file SHA if it exists on a given ref/branch, else ''."""
    url = gh_contents_url(owner, repo, path)
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}
    params = {"ref": ref}
    r = requests.get(url, headers=headers, params=params)
    if r.status_code == 200:
        data = r.json()
        return data.get("sha", "")
    return ""


def gh_put_file(owner: str, repo: str, path: str, content_bytes: bytes, message: str, token: str, branch: str) -> Tuple[bool, Dict]:
    """Create or update a file via GitHub Contents API."""
    url = gh_contents_url(owner, repo, path)
    headers = {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}
    b64 = base64.b64encode(content_bytes).decode("utf-8")
    # If file exists, include its sha to update; otherwise create new.
    sha = gh_get_sha_if_exists(owner, repo, path, token, branch)
    payload = {
        "message": message,
        "content": b64,
        "branch": branch,
    }
    if sha:
        payload["sha"] = sha
    r = requests.put(url, headers=headers, data=json.dumps(payload))
    try:
        data = r.json()
    except Exception:
        data = {"raw": r.text}
    return (200 <= r.status_code < 300, data)


def save_story_to_github(meta: Dict, files: List[io.BytesIO]) -> Dict:
    """Save story.json and any uploaded files next to it in the repo.
    Returns a dict with success flag and a list of created artifacts.
    """
    gh = get_gh_cfg()
    owner, repo, token, branch = gh["owner"], gh["repo"], gh["token"], gh["branch"]

    today = dt.date.today().isoformat()
    node_id = str(uuid.uuid4())[:8]

    state_slug = slugify(meta.get("state", "unknown"))
    village_slug = slugify(meta.get("village", "unknown"))
    story_slug = slugify(meta.get("title", "story"))

    base_dir = f"data/{state_slug}/{village_slug}/{today}/{node_id}"

    # 1) Save story.json
    story_path = f"{base_dir}/story.json"
    commit_msg = f"feat(story): {meta.get('title', 'New Story')} ({village_slug}, {state_slug})"
    ok, data_json = gh_put_file(owner, repo, story_path, json.dumps(meta, ensure_ascii=False, indent=2).encode("utf-8"), commit_msg, token, branch)

    artifacts = []
    if ok:
        artifacts.append({
            "type": "json",
            "path": story_path,
            "html_url": data_json.get("content", {}).get("html_url"),
        })
    else:
        return {"ok": False, "error": data_json}

    # 2) Save each media file
    for f in files:
        # f is the uploaded file object from Streamlit
        fname = getattr(f, 'name', 'upload.bin')
        # sanitize and append a tiny uid to prevent collisions
        name_root, ext = re.sub(r"[^A-Za-z0-9_.-]", "_", fname), ""
        if "." in name_root:
            *root_parts, ext = name_root.split(".")
            ext = ext.lower()
            name_root = ".".join(root_parts)
        safe_name = f"{slugify(name_root)}-{node_id}.{ext or 'bin'}"
        media_path = f"{base_dir}/{safe_name}"
        content = f.read()

        # Size guardrail (e.g., 15 MB per file). Adjust as needed.
        if len(content) > 15 * 1024 * 1024:
            return {"ok": False, "error": f"File {fname} exceeds 15 MB limit."}

        ok2, data_media = gh_put_file(owner, repo, media_path, content, f"asset: {fname}", token, branch)
        if not ok2:
            return {"ok": False, "error": data_media}
        artifacts.append({
            "type": "media",
            "path": media_path,
            "html_url": data_media.get("content", {}).get("html_url"),
        })

    return {"ok": True, "artifacts": artifacts, "dir": base_dir}


# ──────────────────────────────────────────────────────────────────────────────
# Sidebar
with st.sidebar:
    st.title("🧭 Navigation")
    st.caption("Collecting culturally rich stories from Indian villages ✨")

    st.markdown("""
    **How it works**
    1. Fill the form → review.
    2. Submit with consent.
    3. Your story is committed to the GitHub repo.
    """)

    st.divider()
    st.subheader("🔐 Privacy")
    st.caption("Only share what you're comfortable with. Avoid sensitive details.")

    st.divider()
    st.subheader("📦 Repo Settings")
    gh_ok = True
    try:
        gh = get_gh_cfg()
        st.write("**Owner**:", gh["owner"])  # don't print token
        st.write("**Repo**:", gh["repo"])
        st.write("**Branch**:", gh.get("branch", "main"))
    except Exception:
        gh_ok = False

# ──────────────────────────────────────────────────────────────────────────────
# Hero header
st.markdown(
    """
<div class="hero">
  <h1>📜 My Village, My Story</h1>
  <p class="muted">An open platform to collect, preserve, and celebrate stories from villages across India — in any language, with photos, audio, or video.</p>
  <div class="caps">Open-source • Streamlit • GitHub-backed</div>
</div>
""",
    unsafe_allow_html=True,
)

st.write("")

# ──────────────────────────────────────────────────────────────────────────────
# Tabs
submit_tab, explore_tab = st.tabs(["✍️ Submit a Story", "🔎 Explore (Repo)"])

with submit_tab:
    st.subheader("Tell us about your story")
    with st.form("story_form", clear_on_submit=False):
        colA, colB, colC = st.columns([1,1,1])
        with colA:
            state = st.text_input("State / UT", placeholder="e.g., Telangana")
            village = st.text_input("Village / Town", placeholder="e.g., Karimnagar")
            language = st.text_input("Language", placeholder="e.g., Telugu, Hindi, Urdu, English")
        with colB:
            title = st.text_input("Story Title", placeholder="A short title for your story")
            contributor = st.text_input("Contributor (optional)")
            contact = st.text_input("Contact (optional)")
        with colC:
            tags_raw = st.text_input("Tags (comma-separated)", placeholder="festivals, crafts, folklore")
            approx_year = st.text_input("Approx. Year (optional)", placeholder="e.g., 1998 or 'since childhood'")
            category = st.selectbox("Category", ["Folklore", "History", "Personal Memory", "Craft", "Food", "Festival", "Song/Poem", "Other"], index=2)

        story = st.text_area("Your Story", height=220, placeholder="Write in your own words. You can include both text and summaries of any media you upload below.")

        st.markdown("**Upload Media (optional)**")
        col1, col2, col3 = st.columns(3)
        with col1:
            imgs = st.file_uploader("Images", type=["png","jpg","jpeg"], accept_multiple_files=True)
        with col2:
            auds = st.file_uploader("Audio", type=["mp3","wav","m4a"], accept_multiple_files=True)
        with col3:
            vids = st.file_uploader("Video", type=["mp4","mov","mkv"], accept_multiple_files=True)

        agree = st.checkbox("I confirm this is my original submission or I have permission to share it. I consent to publish it under the repo's license.")

        preview = st.form_submit_button("👀 Preview")
        submit = st.form_submit_button("🚀 Submit to GitHub", use_container_width=True)

    # live chips for tags
    if tags_raw:
        st.write("Tags:", " ".join([f"<span class='chip'>#{t.strip()}</span>" for t in tags_raw.split(',') if t.strip()]), unsafe_allow_html=True)

    meta = {
        "title": title.strip() if title else "",
        "state": state.strip() if state else "",
        "village": village.strip() if village else "",
        "language": language.strip() if language else "",
        "story": story.strip() if story else "",
        "contributor": contributor.strip() if contributor else "",
        "contact": contact.strip() if contact else "",
        "tags": [t.strip() for t in tags_raw.split(',') if t.strip()] if tags_raw else [],
        "approx_year": approx_year.strip() if approx_year else "",
        "category": category,
        "timestamp": dt.datetime.utcnow().isoformat() + "Z",
        "app_version": "1.0.0",
    }

    if preview and (title or story):
        st.success("Preview below (not saved yet):")
        st.markdown(f"### {meta['title']}")
        left, right = st.columns([2,1])
        with left:
            st.write(meta["story"] or "(No story text)")
        with right:
            st.caption("Metadata")
            st.json({k: v for k, v in meta.items() if k not in ("story",)})

    if submit:
        # Validation
        required = [("State", state), ("Village", village), ("Language", language), ("Title", title), ("Story", story)]
        missing = [name for name, val in required if not val or not val.strip()]
        if missing:
            st.error("Please fill required fields: " + ", ".join(missing))
        elif not agree:
            st.error("Please confirm the consent checkbox to proceed.")
        else:
            uploads = (imgs or []) + (auds or []) + (vids or [])
            with st.spinner("Saving to GitHub repo…"):
                result = save_story_to_github(meta, uploads)
            if result.get("ok"):
                st.balloons()
                st.success("Your story has been saved! 🎉")
                st.markdown("**Created files:**")
                for art in result.get("artifacts", []):
                    if art.get("html_url"):
                        st.markdown(f"- [{art['path']}]({art['html_url']})", unsafe_allow_html=True)
                    else:
                        st.write("-", art.get("path"))
                st.caption(f"Folder: {result.get('dir')}")
            else:
                st.error("Failed to save. See details below.")
                st.json(result.get("error"))


with explore_tab:
    st.caption("This lightweight viewer fetches the top-level 'data' tree. Click links to open on GitHub.")
    gh = None
    try:
        gh = get_gh_cfg()
    except Exception:
        pass

    if gh:
        base_api = f"https://api.github.com/repos/{gh['owner']}/{gh['repo']}/contents/data"
        headers = {"Authorization": f"Bearer {gh['token']}", "Accept": "application/vnd.github+json"}
        params = {"ref": gh.get("branch", "main")}
        r = requests.get(base_api, headers=headers, params=params)
        if r.status_code == 200 and isinstance(r.json(), list):
            top = r.json()
            cols = st.columns(3)
            for i, node in enumerate(top):
                with cols[i % 3]:
                    st.markdown(f"**{node.get('name','(folder)')}**")
                    st.caption(node.get('path', ''))
                    if node.get('html_url'):
                        st.markdown(f"[Open on GitHub]({node['html_url']})")
        else:
            st.info("No data yet or insufficient permissions.")

# ──────────────────────────────────────────────────────────────────────────────
# Footer note
st.write("")
st.markdown("<hr>", unsafe_allow_html=True)
st.caption("Built with ❤️ using Streamlit. Data saved to GitHub for transparency and collaboration.")
