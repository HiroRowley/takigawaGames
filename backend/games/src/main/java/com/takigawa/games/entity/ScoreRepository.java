
package com.takigawa.games.entity;

import com.takigawa.games.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ScoreRepository
        extends JpaRepository<Score, Long> {

    // 最も小さいscoreを取得
    Score findTopByOrderByScoreAsc();
}

