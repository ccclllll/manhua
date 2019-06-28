package com.ac.server.web.dto;

import com.ac.server.domain.Cover;

import java.util.List;

public class RecommendDataDTO {
    private String title;
    private List<Cover> covers;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<Cover> getCovers() {
        return covers;
    }

    public void setCovers(List<Cover> covers) {
        this.covers = covers;
    }

    @Override
    public String toString() {
        return "RecommendDataDTO{" +
                "title='" + title + '\'' +
                ", covers=" + covers +
                '}';
    }
}
