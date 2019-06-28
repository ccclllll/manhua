package com.ac.server.book;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.util.logging.Logger;

public class BookUtils {
    Logger logger = Logger.getLogger("BookUtils");
    public static void main(String[] args) throws Exception{
        BookUtils bookUtils = new BookUtils();
        Document document = Jsoup.connect("http://www.bqg99.com/book/1450365435/1077495642.html").get();
        System.out.println(document.toString());
    }
}
