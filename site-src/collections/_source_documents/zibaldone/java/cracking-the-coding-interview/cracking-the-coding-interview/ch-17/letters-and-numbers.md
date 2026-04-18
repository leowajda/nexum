---
project_slug: zibaldone
project_title: Zibaldone
project_url: "/zibaldone/"
project_source_url: https://github.com/leowajda/zibaldone
language_slug: java
language_title: Java
language_url: "/zibaldone/java/"
module_slug: cracking-the-coding-interview
module_title: Cracking the Coding Interview
title: LettersAndNumbers.java
tree_path: src/main/java/cracking_the_coding_interview/ch_17/LettersAndNumbers.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/LettersAndNumbers.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_17/LettersAndNumbers.java
language: java
format: code
breadcrumbs:
- label: Zibaldone
  url: "/zibaldone/"
- label: Java
  url: "/zibaldone/java/"
- label: Cracking the Coding Interview
  url: "/zibaldone/java/cracking-the-coding-interview/"
- label: cracking_the_coding_interview
  url: ''
- label: ch_17
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_17/LettersAndNumbers.java
description: LettersAndNumbers.java notes
---

~~~java
package cracking_the_coding_interview.ch_17;

import java.util.HashMap;
import java.util.Map;

public class LettersAndNumbers {

    private record Counter(int letterCount, int digitCount) {
        public int min() {
            return Math.min(letterCount, digitCount);
        }

        public Counter update(char ch) {
            boolean isDigit = Character.isDigit(ch);
            return isDigit ? new Counter(letterCount, digitCount + 1) : new Counter(letterCount + 1, digitCount);
        }
    }

    private static int lettersAndNumbers(char[] chars) {

        int n = chars.length;
        int longestSubarray = 0;
        Map<Integer, Counter> map = new HashMap<>(n);
        map.put(-1, new Counter(0, 0));

        for (int i = 0; i < n; i++) {
            var newCounter = map.get(i - 1).update(chars[i]);
            map.put(i, newCounter);
            int minCount = newCounter.min();
            var prevCounter = map.get(i - minCount * 2);

            if (minCount == newCounter.letterCount && (newCounter.digitCount - prevCounter.digitCount) == minCount)
                longestSubarray = Math.max(longestSubarray, minCount * 2);

            if (minCount == newCounter.digitCount && (newCounter.letterCount - prevCounter.letterCount) == minCount)
                longestSubarray = Math.max(longestSubarray, minCount * 2);
        }

        return longestSubarray;
    }
}
~~~
