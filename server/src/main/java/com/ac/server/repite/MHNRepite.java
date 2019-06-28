package com.ac.server.repite;

import com.ac.server.domain.Book;
import com.ac.server.domain.Cover;
import com.ac.server.web.dto.RecommendDataDTO;
import okhttp3.OkHttpClient;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.List;


public class MHNRepite implements CaptureBookData{
    public static final String MHNURL = "https://m.manhuaniu.com/";
    private static OkHttpClient client = new OkHttpClient.Builder().build();

    public static void main(String[] args) throws Exception{
        //swipperCover();
        //mhnImgs( "https://m.manhuaniu.com/manhua/6145/221984.html");
        MHNRepite mhnRepite = new MHNRepite();
        //System.out.println(mhnRepite.captureRecommendData()) ;
        //System.out.println(mhnRepite.buildACBook("https://m.manhuaniu.com/manhua/6146/"));
        mhnRepite.search("狐妖");

    }

    @Override
    public List<RecommendDataDTO> captureRecommendData() throws Exception {
        List<RecommendDataDTO> recommendDataDTOS = new ArrayList<>();
        Document document = Jsoup.connect(MHNURL).get();
        Elements imgBoxs = document.getElementsByClass("imgBox");

        imgBoxs.forEach(element -> {
            RecommendDataDTO dataDTO = new RecommendDataDTO();
            List<Cover> covers = new ArrayList<>();
            dataDTO.setTitle(element.getElementsByClass("Title").get(0).text());
            element.getElementsByTag("li").forEach(li->{
                Cover cover = new Cover();
                Element alink = li.getElementsByClass("txtA").get(0);
                cover.setTitle(alink.text());
                cover.setDetailUrl(alink.attr("href"));
                cover.setImgUrl(li.getElementsByTag("mip-img").attr("src"));
                cover.setSection(li.getElementsByTag("a").get(1).text());
                covers.add(cover);
            });
            dataDTO.setCovers(covers);
            recommendDataDTOS.add(dataDTO);
        });
        return recommendDataDTOS;
    }

    @Override
    public List<Cover> search(String key) throws Exception {
        Document document = Jsoup.connect("https://m.manhuaniu.com/search/?keywords="+key).get();

        List<Cover> covers = new ArrayList<>();
       // System.out.println(document);
        document.getElementsByClass("itemBox").forEach(element -> {
            Cover cover = new Cover();
            Element alink = element.getElementsByTag("a").get(1);
            cover.setTitle(alink.text());
            cover.setDetailUrl(alink.attr("href"));
            cover.setSection(element.getElementsByClass("coll").get(0).text());
            cover.setImgUrl(element.getElementsByTag("mip-img").get(0).attr("src"));
            covers.add(cover);
        });
        return covers;
    }

    @Override
    public Book buildACBook(String url) throws Exception {
        Book acBook = new Book();
        Document document = Jsoup.connect(url).get();
        List<Book.Chapter> chapters = new ArrayList<>();
        Element ul = document.getElementById("chapter-list-1");
       // System.out.println(ul.getElementsByTag("li"));

        ul.getElementsByTag("li").forEach(li->{
            Book.Chapter chapter = acBook.new Chapter();
            chapter.title = li.getElementsByTag("span").get(0).text();
            Element alink = li.getElementsByTag("a").get(0);
            chapter.detailUrl = alink.attr("href");
            chapters.add(chapter);
        });

        Element book = document.getElementsByClass("pic").get(0);

        Elements pic_zi = book.getElementsByClass("pic_zi");
        acBook.setUpdateTime(pic_zi.get(3).getElementsByClass("left").get(1).text());
        acBook.setChapters(chapters);
        acBook.setAuthor(pic_zi.get(1).getElementsByClass("left").get(1).text());
        acBook.setCategory(pic_zi.get(2).getElementsByClass("left").get(1).text());
        return acBook;
    }

    @Override
    public List<String> chapterImgs(String url) throws Exception {
        List<String> imgs = new ArrayList<>();
        Document document = Jsoup.connect(url).get();
        Element total = document.getElementById("k_total");
        int pages = Integer.parseInt(total.text());


        imgs.add(document.getElementsByTag("mip-img").get(0).attr("src"));
        for(int index = 2;index<=pages;index++){
            document = Jsoup.connect(url.replace(".html","-"+index+".html")).get();
            imgs.add(document.getElementsByTag("mip-img").get(0).attr("src"));
        }
        return imgs;
    }

    @Override
    public List<Cover> swipperData() throws Exception {
        List<Cover> covers = new ArrayList<>();
        try{
            Document document = Jsoup.connect(MHNURL).get();
            Elements elements = document.select("#w0>a");
            elements.forEach(e->{
                Cover cover = new Cover();
                cover.setDetailUrl(e.attr("href"));
                cover.setImgUrl(e.getElementsByTag("mip-img").get(0).attr("src"));
                cover.setTitle(e.getElementsByClass("mip-carousle-subtitle").get((0)).text());
                covers.add(cover);
            });
        }catch (Exception e){
        }
        return covers;
    }

    @Override
    public String[] bookContent(String url) throws Exception {
        return null;
    }
}
