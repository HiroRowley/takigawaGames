
package com.takigawa.games.service;

import com.takigawa.games.entity.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScoreService {

    @Autowired
    private ScoreRepository repository;

    // スコア保存
    public Score saveScore(Score score) {

        return repository.save(score);
    }

    // 最悪記録取得
    public Score getWorstScore() {

        return repository.findTopByOrderByScoreAsc();
    }
}

