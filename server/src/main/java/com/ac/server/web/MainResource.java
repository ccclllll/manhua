package com.ac.server.web;

import com.ac.server.domain.Book;
import com.ac.server.domain.Cover;
import com.ac.server.repite.CaptureBookData;
import com.ac.server.repite.MHNRepite;
import com.ac.server.web.dto.RecommendDataDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api")
public class MainResource {
    private CaptureBookData acRepite = new MHNRepite();

    @GetMapping("/recommend")
    public ResponseEntity<List<RecommendDataDTO>> recommendDataDTOS(){
        try {
            return  new ResponseEntity<>(acRepite.captureRecommendData(),HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.GATEWAY_TIMEOUT);
        }
    }

    @GetMapping("/search/{key}")
    public ResponseEntity<List<Cover>> search(@PathVariable String key){

        try {
            return new ResponseEntity<>(acRepite.search(key),HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.GATEWAY_TIMEOUT);
        }
    }

    @GetMapping("/acbook")
    public ResponseEntity<Book> acBook(String url) throws Exception{
        try{
            return new ResponseEntity<>(acRepite.buildACBook(url),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(new Book(), HttpStatus.GATEWAY_TIMEOUT);
        }

    }

    @GetMapping("/chapter")
    public ResponseEntity<List<String>> chapter(String url) throws Exception{
        try {
            return new ResponseEntity<>(acRepite.chapterImgs(url),HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(new ArrayList<>(),HttpStatus.GATEWAY_TIMEOUT);
        }
    }

    @GetMapping("/swipper")
    public ResponseEntity<List<Cover>> swippers(){
        try {
            return new ResponseEntity<>(acRepite.swipperData(),HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ArrayList<>(), HttpStatus.GATEWAY_TIMEOUT);
        }
    }
}
