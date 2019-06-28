package com.ac.server.web;

import com.ac.server.domain.Book;
import com.ac.server.domain.Cover;
import com.ac.server.repite.BiqugeBook;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
@CrossOrigin("*")
@RequestMapping("/api/book")
@RestController
public class BookResource {
    private BiqugeBook biqugeBook = new BiqugeBook();

    public List<List<String>> generateContent(String[] content,Integer size){
        List<List<String>> ret = new ArrayList<>();
        List<String> page = new ArrayList<>();
        int sectionCount = 0;
        int maxLine = 10;
        int lineCount = 0;
        int line =22 / (size/22);
        int index = 0;

        while (index<content.length){

            if(lineCount<maxLine){
                String con = content[index];
                int lineNum = con.length()/line == 0 ? 1:con.length()/line;


                if(lineCount+lineNum<=maxLine){
                    if(sectionCount<4&&maxLine!=13){
                        maxLine=13;
                        continue;
                    }
                    lineCount+=lineNum;
                    page.add(con);
                    sectionCount++;
                    index++;

                }else{
                    //System.out.println(lineCount);

                    if(sectionCount<4&&maxLine!=13){
                        maxLine=13;
                        continue;
                    }

                    int subIndex = (maxLine - lineCount)*line - 1;
                    String preString = con.substring(0,subIndex);
                    String nexString = con.substring(subIndex,con.length());

                    page.add(preString);

                    ret.add(page);
                    page = new ArrayList<>();
                    lineCount = 0;
                    content[index] = nexString;

                }

            }else{

                ret.add(page);
                page = new ArrayList<>();
                lineCount = 0;
                index++;
                maxLine=10;

            }
        }
        ret.add(page);

        return  ret;
    }
    public List<List<String>> generateContent2(String[] content,Integer size){
        List<List<String>> ret = new ArrayList<>();
        List<String> page = new ArrayList<>();
        int index = 0;
        int lineNums  = 18; // 每行字数
        int lineCount = 0;
        int maxLineCount = 16;

        lineNums = lineNums / (size/18);
        maxLineCount = maxLineCount / (size/18);
        while (index<content.length) {
            String con = content[index];

            // 本页行数小于16行
            if(lineCount<maxLineCount){

                // 本段落字数刚好为18个字
                if(con.length()<=lineNums){
                    page.add(con);
                    lineCount++;
                    index++; // 对下一段落进行处理
                }else{

                    // 段落字数超过十八字
                    int beginIndex = 0;
                    int endIndex = 19;

                    // 本页行数小于16行
                    while (lineCount<maxLineCount){


                        // 索引小于本段落字数
                        if(endIndex<con.length()){
                            lineCount++;
                            page.add(con.substring(beginIndex,endIndex));
                            beginIndex = endIndex;
                            endIndex=beginIndex+18;
                        }else{

                            page.add(con.substring(beginIndex,con.length()));
                            lineCount++;
                            endIndex = con.length();
                            beginIndex = endIndex;
                            index++; // 当前页未满
                            break; // 跳出循环，对下个段落进行处理
                        }
                    }

                    // 当前页满后 这段文字还有剩余
                    if(beginIndex<con.length()){
                        content[index] = con.substring(beginIndex,con.length()); // 对剩余的字数进行操作
                    }

                }
            }else{
                // 开始下一页
                ret.add(page);
                lineCount=0;
                page = new ArrayList<>();
            }
        }

        ret.add(page);
        return ret;


    }

    @GetMapping("/content")
    public ResponseEntity<List<List<String>> > getContent(String url, Integer size) throws Exception{

        if(size == null){
            size = 18;
        }

        try {
            return new ResponseEntity<>(generateContent2(biqugeBook.bookContent(url),size),HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
    @GetMapping("/swipper")
    public ResponseEntity<List<Cover>> swippers(){
        try {
            return new ResponseEntity<>(biqugeBook.swipperData(),HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.GATEWAY_TIMEOUT);
        }
    }

    @GetMapping("/acbook")
    public ResponseEntity<Book> acBook(String url) throws Exception{
        try{
            return new ResponseEntity<>(biqugeBook.buildACBook(url),HttpStatus.OK);
        }catch (Exception e){
            e.printStackTrace();
            return new ResponseEntity<>(new Book(), HttpStatus.GATEWAY_TIMEOUT);
        }

    }
    @GetMapping("/search/{key}")
    public ResponseEntity<List<Cover>> search(@PathVariable String key){

        try {
            return new ResponseEntity<>(biqugeBook.search(key),HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.GATEWAY_TIMEOUT);
        }
    }

}
