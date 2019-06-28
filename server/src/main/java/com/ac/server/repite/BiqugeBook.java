package com.ac.server.repite;

import com.ac.server.domain.Book;
import com.ac.server.domain.Cover;
import com.ac.server.web.dto.RecommendDataDTO;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import java.util.ArrayList;
import java.util.List;

public class BiqugeBook implements CaptureBookData {
    public static String BASE_URL = "http://www.bqg99.com";

    private static OkHttpClient client = new OkHttpClient.Builder().build();
    @Override
    public List<RecommendDataDTO> captureRecommendData() throws Exception {
        Document document = Jsoup.connect(BASE_URL).get();

        document.getElementsByClass("hot").get(0).getElementsByClass("item").forEach(item->{
        });
        return null;
    }

    @Override
    public List<Cover> search(String key) throws Exception {

        String search = "http://www.bqg99.com/s.php?q=";
        List<Cover> covers = new ArrayList<>();
        Document document = Jsoup.connect(search+key).get();
        //System.out.println(document.toString());
        document.getElementsByClass("bookbox").forEach(book->{
            Cover cover = new Cover();
            cover.setTitle(book.getElementsByClass("bookname").get(0).text());
            Element alink = book.getElementsByClass("bookimg").get(0).getElementsByTag("a").get(0);
            cover.setImgUrl(alink.getElementsByTag("img").get(0).attr("src"));
            cover.setDetailUrl(alink.attr("href"));
            cover.setSimpleDetail(book.getElementsByTag("p").last().text());
            cover.setAuthor(book.getElementsByClass("author").text());
            cover.setSection(book.getElementsByClass("update").get(0).getElementsByTag("a").get(0).text());
            covers.add(cover);
            System.out.println(cover);
        });
        return covers;
    }

    @Override
    public Book buildACBook(String url) throws Exception {
        Document document = Jsoup.connect(url).get();
        Book book = new Book();
        List<Book.Chapter> chapters = new ArrayList<>();
        document.getElementsByClass("listmain").get(0).getElementsByTag("dd").forEach(item->{
            Book.Chapter chapter = book.new Chapter();
            Element alink = item.getElementsByTag("a").get(0);
            chapter.detailUrl = alink.attr("href");
            chapter.title = alink.text();
            chapters.add(chapter);
        });
        Cover cover = new Cover();
        Element info = document.getElementsByClass("info").get(0);
        cover.setTitle(info.getElementsByTag("h1").get(0).text());
        Element small = info.getElementsByClass("small").get(0);
        cover.setAuthor(small.getElementsByTag("span").get(0).text().split("：")[1]);
        book.setChapters(chapters);
        book.setCover(cover);

        return book;
    }

    @Override
    public List<String> chapterImgs(String url) throws Exception {
        return null;
    }

    @Override
    public List<Cover> swipperData() throws Exception {
        Document document = Jsoup.connect(BASE_URL).get();

        List<Cover> covers = new ArrayList<>();
        document.getElementsByClass("hot").get(0).getElementsByClass("item").forEach(item->{
            Cover cover = new Cover();
            cover.setImgUrl(item.getElementsByTag("img").get(0).attr("src"));
            Element alink = item.getElementsByTag("a").get(1);
            cover.setDetailUrl(alink.attr("href"));
            cover.setTitle(alink.text());
            cover.setAuthor(item.getElementsByTag("dt").get(0).getElementsByTag("span").get(0).text());
            cover.setSimpleDetail(item.getElementsByTag("dd").get(0).text());
            covers.add(cover);
        });
        return covers;
    }

    @Override
    public String[] bookContent(String url) throws Exception {
        Document document = Jsoup.connect(url).get();
        System.out.println( document.getElementById("content").text());
        return document.getElementById("content").text().split(" ");
    }

    public static void main(String[] args) throws Exception{
        BiqugeBook biqugeBook = new BiqugeBook();
//        System.out.println(biqugeBook.bookContent(BASE_URL));
        //biqugeBook.swipperData();
        biqugeBook.search("我有一座");

    }
}
