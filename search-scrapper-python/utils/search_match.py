def find_match(main_sentence, sentences):
    main_tokens = main_sentence.lower().split(' ')
    matches = []

    for index, sentence in enumerate(sentences):
        sentence_tokens = sentence.lower().split(' ')
        distance = edit_distance(main_tokens, sentence_tokens)
        similarity = 1 - \
            (distance / max(len(main_tokens), len(sentence_tokens)))
        matches.append({'index': index, 'similarity': similarity})

    matches.sort(key=lambda x: x['similarity'], reverse=True)

    if matches:
        return matches[0]['index']
    else:
        return None


def edit_distance(s1, s2):
    memo = [[0] * (len(s2) + 1) for _ in range(len(s1) + 1)]

    for i in range(len(s1) + 1):
        memo[i][0] = i
    for j in range(len(s2) + 1):
        memo[0][j] = j

    for i in range(1, len(s1) + 1):
        for j in range(1, len(s2) + 1):
            cost = 0 if s1[i - 1] == s2[j - 1] else 1
            memo[i][j] = min(
                memo[i - 1][j] + 1,
                memo[i][j - 1] + 1,
                memo[i - 1][j - 1] + cost
            )

    return memo[len(s1)][len(s2)]


__all__ = ['find_match']
