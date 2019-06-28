package com.ac.server.repite;

import com.ac.server.domain.Book;
import com.ac.server.domain.Cover;
import com.ac.server.web.dto.RecommendDataDTO;
import okhttp3.*;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;


import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class AcRepite implements CaptureBookData{

    public static final String BASE_URL = "https://m.bnmanhua.com";
    private static OkHttpClient client = new OkHttpClient.Builder().build();

    public static List<RecommendDataDTO> getIndexData(){
        List<RecommendDataDTO> recommends = new ArrayList<>();
        try{
            Document document = Jsoup.connect("https://m.bnmanhua.com/").get();
            //System.out.println(document.title());
            Elements data = document.getElementsByClass("tbox");
            data.forEach(element -> {
                RecommendDataDTO dataDTO = new RecommendDataDTO();
                Elements titles = element.getElementsByTag("h3");
                Elements coverEles = element.getElementsByClass("vbox");
                dataDTO.setCovers(resolveCoverElement(coverEles));
                if(titles.size()>0){
                    dataDTO.setTitle(titles.get(0).text());
                }
                recommends.add(dataDTO);
            });
        } catch (IOException e) {
            e.printStackTrace();
        }

        return recommends;
    }

    public static List<Cover> resolveCoverElement(Elements coverEles){
        List<Cover> covers = new ArrayList<>();
        coverEles.forEach(coverEle -> {
            Cover cover = new Cover();
            Element aLink = coverEle.getElementsByClass("vbox_t").get(0);
            cover.setDetailUrl(BASE_URL + aLink.attr("href"));
            cover.setTitle(aLink.attr("title"));
            cover.setImgUrl(coverEle.getElementsByTag("mip-img").get(0).attr("src"));
            cover.setSection(coverEle.getElementsByTag("span").get(0).text());
            covers.add(cover);
        });
        return covers;
    }

    @Override
    public List<RecommendDataDTO> captureRecommendData() throws Exception {
        return null;
    }

    public List<Cover> search(String key) throws Exception{

        FormBody.Builder formBuilder = new FormBody.Builder();
        formBuilder.add("wd",key);
        Request.Builder builder = new Request.Builder().url("https://m.bnmanhua.com/index.php?m=vod-search").post(formBuilder.build());
        Response response = client.newCall(builder.build()).execute();
        Document document = Jsoup.parse(new String(response.body().bytes(),"utf-8"));
        Elements coverEles = document.getElementsByClass("vbox");
        List<Cover> covers = resolveCoverElement(coverEles);
        return covers;
    }

    public Book buildACBook(String url) throws Exception{
        Book book = new Book();
        List<Book.Chapter> chapters = new ArrayList<>();
        Document document = Jsoup.connect(url).get();
        book.setCategory(document.getElementsByClass("yac").get(0).text());
        book.setAuthor(document.getElementsByClass("dir").get(0).text());
        book.setUpdateTime(document.getElementsByClass("act").get(0).text());
        document.select("ul.list_block.show").get(0).getElementsByTag("li").forEach(li->{
            Book.Chapter chapter = book.new Chapter();
            Element aLink = li.getElementsByTag("a").get(0);
            chapter.detailUrl = BASE_URL+ aLink.attr("href");
            chapter.title = aLink.text();
            chapters.add(chapter);
        });
        book.setChapters(chapters);

        return book;
    }

    @Override
    public List<String> chapterImgs(String url) throws Exception {
        Document document = Jsoup.connect(url).get();
        String docString = document.toString();

        String z_yurl = "";
        String z_img = "";
        String[] pages = new String[1];
        String patternStr1 = "z_yurl='([\\S]+)'";

        // 解析z_yurl
        Pattern pattern = Pattern.compile(patternStr1);
        Matcher m = pattern.matcher(docString);
        if (m.find( )) {
            z_yurl = m.group(0);
            z_yurl = z_yurl.substring(8,z_yurl.length()-1).replace("http://","");
        } else {
            System.out.println("NO MATCH");
        }

        // 解析z_img
        pattern = Pattern.compile("z_img='([\\S]+)'");
        Matcher m1 = pattern.matcher(docString);
        if (m1.find( )) {
            z_img = m1.group(0);
            pages = m1.group(0).substring(8,z_img.length()-2).split(",");
            System.out.println(pages);
        } else {
            System.out.println("NO MATCH");
        }

        // 拼接图片地址
        int count = 0;
        List<String> chapterImgs = new ArrayList<>();
        while (count<pages.length){
            chapterImgs.add("https://m-bnmanhua-com.mipcdn.com/i/" + z_yurl + pages[count].substring(1,pages[count].length()-1));
            //System.out.println(chapterImgs[count]);
            count++;
        }

        return chapterImgs;
    }

    @Override
    public List<Cover> swipperData() throws Exception {
        return null;
    }

    @Override
    public String[] bookContent(String url) throws Exception {
        return null;
    }


    public static void main(String[] args) throws Exception{
//        List<RecommendDataDTO> recommendDataDTOS = AcRepite.getIndexData();
//        recommendDataDTOS.forEach(recommendDataDTO -> System.out.println(recommendDataDTO));
//        search("狐妖小红娘");
        //buildACBook("https://m.bnmanhua.com/comic/4815.html");
//        System.out.println(chapterImg("https://m.bnmanhua.com/comic/4815/895347.html"));
    }
}
