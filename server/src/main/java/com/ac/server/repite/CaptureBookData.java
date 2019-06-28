package com.ac.server.repite;

import com.ac.server.domain.Book;
import com.ac.server.domain.Cover;
import com.ac.server.web.dto.RecommendDataDTO;

import java.util.List;

public interface CaptureBookData {
    List<RecommendDataDTO> captureRecommendData() throws Exception; // 首页推荐
    //List<Cover> resolveCoverElement(Elements elements) throws Exception;
    List<Cover> search(String key) throws Exception; // 搜索
    Book buildACBook(String url) throws Exception; // 书籍详情
    List<String> chapterImgs(String url) throws Exception; // 章节图片
    List<Cover> swipperData() throws Exception;
    String[] bookContent(String url) throws Exception;
}
