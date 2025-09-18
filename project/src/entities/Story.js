// Story entity (simple JS model)
export default class Story {
  constructor({ id, title, body, author, village, media = [], audio = null, createdAt = new Date() }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.author = author;
    this.village = village;
    this.media = media;
    this.audio = audio;
    this.createdAt = createdAt;
  }
}
