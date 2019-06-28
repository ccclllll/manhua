package com.ac.server.domain;

import java.util.List;

public class Book {
    private Cover cover;
    private String category;
    private String author;
    private String updateTime;
    private List<Chapter> chapters;
    private String type;
    public class Chapter{
        public String title;
        public String detailUrl;

        @Override
        public String toString() {
            return "Chapter{" +
                    "title='" + title + '\'' +
                    ", detailUrl='" + detailUrl + '\'' +
                    '}';
        }
    }

    public Cover getCover() {
        return cover;
    }

    public void setCover(Cover cover) {
        this.cover = cover;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public List<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(List<Chapter> chapters) {
        this.chapters = chapters;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "Book{" +
                "cover=" + cover +
                ", category='" + category + '\'' +
                ", author='" + author + '\'' +
                ", updateTime='" + updateTime + '\'' +
                ", chapters=" + chapters +
                '}';
    }
}
