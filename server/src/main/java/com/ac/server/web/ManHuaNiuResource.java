package com.ac.server.web;

import com.ac.server.domain.Cover;
import com.ac.server.repite.MHNRepite;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/mhn")
public class ManHuaNiuResource {
//    @GetMapping("/swippers")
//    public ResponseEntity<List<Cover>> swippers(){
//        try{
//            return new ResponseEntity<>(MHNRepite.swipperCover(),HttpStatus.OK);
//        }catch (Exception e){
//            return new ResponseEntity<>(MHNRepite.swipperCover(),HttpStatus.GATEWAY_TIMEOUT);
//        }
//    }
}
