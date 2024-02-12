const findMatch = (main_sentence, sentences) => {
    const main_tokens = main_sentence.toLowerCase().split(' ');
    let matches = [];

    sentences.forEach((sentence, index) => {
        const sentence_tokens = sentence.toLowerCase().split(' ');
        const distance = editDistance(main_tokens, sentence_tokens);
        const similarity = 1 - (distance / Math.max(main_tokens.length, sentence_tokens.length));
        matches.push({ index, similarity });
    });

    matches.sort((a, b) => b.similarity - a.similarity);

    if (matches.length > 0) {
        return matches[0].index;
    } else {
        return null;
    }
}

const editDistance = (s1, s2) => {
    const memo = [];
    for (let i = 0; i <= s1.length; i++) {
        memo[i] = [i];
    }
    for (let j = 0; j <= s2.length; j++) {
        memo[0][j] = j;
    }
    for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            memo[i][j] = Math.min(
                memo[i - 1][j] + 1,
                memo[i][j - 1] + 1,
                memo[i - 1][j - 1] + cost
            );
        }
    }
    return memo[s1.length][s2.length];
}

module.exports = { findMatch, editDistance }