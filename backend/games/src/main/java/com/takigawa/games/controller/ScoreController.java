
package com.takigawa.games.controller;

import com.takigawa.games.entity.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.takigawa.games.service.*;

@RestController
@RequestMapping("/scores")

public class ScoreController {

    @Autowired
    private ScoreService service;

    // スコア保存
    @PostMapping
    public Score saveScore(@RequestBody Score score) {
        
            return service.saveScore(score);
        
        
    }

    // 最悪記録取得
    @GetMapping("/worst")
    public Score getWorstScore() {

        Score score = service.getWorstScore();

        if (score == null) {
            return new Score(0);
        }else{
        return service.getWorstScore();
        }
    }
}

