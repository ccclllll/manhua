package com.ac.server.domain;

public class Cover {
    private String title;
    private String imgUrl;
    private String section;
    private String detailUrl;
    private String author;
    private String simpleDetail;
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getImgUrl() {
        return imgUrl;
    }

    public void setImgUrl(String imgUrl) {
        this.imgUrl = imgUrl;
    }

    public String getSection() {
        return section;
    }

    public void setSection(String section) {
        this.section = section;
    }

    public String getDetailUrl() {
        return detailUrl;
    }

    public void setDetailUrl(String detailUrl) {
        this.detailUrl = detailUrl;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSimpleDetail() {
        return simpleDetail;
    }

    public void setSimpleDetail(String simpleDetail) {
        this.simpleDetail = simpleDetail;
    }

    @Override
    public String toString() {
        return "Cover{" +
                "title='" + title + '\'' +
                ", imgUrl='" + imgUrl + '\'' +
                ", section='" + section + '\'' +
                ", detailUrl='" + detailUrl + '\'' +
                ", author='" + author + '\'' +
                ", simpleDetail='" + simpleDetail + '\'' +
                '}';
    }
}
