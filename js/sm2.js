/* ============================================================
 * sm2.js  —  SuperMemo SM-2 Spaced Repetition Algorithm
 * ============================================================
 *
 * quality: 0 = complete blackout
 *          1 = incorrect but recognised on seeing answer
 *          2 = incorrect but correct answer felt easy
 *          3 = correct with significant difficulty
 *          4 = correct after hesitation
 *          5 = perfect recall
 * ============================================================ */

const SM2 = {
  MIN_EF: 1.3,

  /**
   * Calculate next review parameters.
   * @param {number} quality  0-5
   * @param {number} ef       ease factor (default 2.5)
   * @param {number} interval days until next review (0 = unseen)
   * @param {number} reps     number of successful reviews in a row
   * @returns {{ ef, interval, reps, nextReview }}
   */
  review(quality, ef = 2.5, interval = 0, reps = 0) {
    let newEF       = ef;
    let newInterval = interval;
    let newReps     = reps;

    if (quality < 3) {
      // Incorrect – reset repetition count but keep EF
      newReps     = 0;
      newInterval = 1;
    } else {
      // Correct
      if (newReps === 0)      newInterval = 1;
      else if (newReps === 1) newInterval = 6;
      else                    newInterval = Math.round(interval * ef);
      newReps++;
    }

    // Update ease factor
    newEF = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEF < this.MIN_EF) newEF = this.MIN_EF;
    newEF = Math.round(newEF * 100) / 100;

    const nextReview = Date.now() + newInterval * 86_400_000;

    return {
      easeFactor:  newEF,
      interval:    newInterval,
      repetitions: newReps,
      nextReview,
    };
  },

  /**
   * Map a simple user rating to SM-2 quality.
   *  'know'    → 5 (perfect)
   *  'unsure'  → 3 (hesitant correct)
   *  'dontknow'→ 1 (incorrect)
   */
  ratingToQuality(rating) {
    return { know: 5, unsure: 3, dontknow: 1 }[rating] ?? 3;
  },

  /**
   * Get cards due for review from a set, sorted by priority.
   * Cards that have never been seen come first, then overdue.
   */
  getDueCards(setId, cards) {
    const now = Date.now();
    return cards
      .map(card => {
        const p = DB.getProgress(setId, card.id);
        return { card, p };
      })
      .filter(({ p }) => p.nextReview <= now)
      .sort((a, b) => {
        // Unseen first (nextReview === 0), then oldest due
        if (a.p.nextReview === 0 && b.p.nextReview !== 0) return -1;
        if (b.p.nextReview === 0 && a.p.nextReview !== 0) return  1;
        return a.p.nextReview - b.p.nextReview;
      })
      .map(({ card }) => card);
  },

  /**
   * Apply a review and persist it.
   */
  applyReview(setId, cardId, rating) {
    const quality = this.ratingToQuality(rating);
    const p       = DB.getProgress(setId, cardId);
    const result  = this.review(quality, p.easeFactor, p.interval, p.repetitions);

    DB.saveProgress(setId, cardId, {
      ...result,
      lastSeen:  Date.now(),
      correct:   p.correct  + (quality >= 3 ? 1 : 0),
      incorrect: p.incorrect + (quality < 3  ? 1 : 0),
    });

    return result;
  },

  /**
   * Return a human-readable next-review string.
   */
  formatNextReview(nextReview) {
    const diff = nextReview - Date.now();
    if (diff <= 0)             return 'Ôn ngay';
    const days = Math.round(diff / 86_400_000);
    if (days === 0)            return 'Hôm nay';
    if (days === 1)            return 'Ngày mai';
    if (days < 7)              return `${days} ngày`;
    if (days < 30)             return `${Math.round(days/7)} tuần`;
    return `${Math.round(days/30)} tháng`;
  },

  /**
   * Compute overall mastery % for a set (0-100).
   */
  masteryPercent(setId, cards) {
    if (!cards.length) return 0;
    const total = cards.reduce((sum, card) => {
      const p = DB.getProgress(setId, card.id);
      // Score: (reps * ef) capped at 5 → normalise to 0-1
      const score = Math.min((p.repetitions * p.easeFactor) / 12.5, 1);
      return sum + score;
    }, 0);
    return Math.round((total / cards.length) * 100);
  },
};
