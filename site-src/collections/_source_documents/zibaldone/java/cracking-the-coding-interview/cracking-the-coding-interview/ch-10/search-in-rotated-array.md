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
title: SearchInRotatedArray.java
tree_path: src/main/java/cracking_the_coding_interview/ch_10/SearchInRotatedArray.java
source_path: java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_10/SearchInRotatedArray.java
source_url: https://github.com/leowajda/zibaldone/blob/master/java/cracking-the-coding-interview/src/main/java/cracking_the_coding_interview/ch_10/SearchInRotatedArray.java
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
- label: ch_10
  url: ''
document_id: java:cracking-the-coding-interview:src/main/java/cracking_the_coding_interview/ch_10/SearchInRotatedArray.java
description: SearchInRotatedArray.java notes
---

~~~java
package cracking_the_coding_interview.ch_10;

public class SearchInRotatedArray {

    // assumes strictly monotonic function
    private static int search(int[] nums, int target) {

        int left = 0, right = nums.length - 1;
        while (left <= right) {

            int middle = left + (right - left) / 2;
            if (nums[middle] == target) return middle;

            if (nums[left] > nums[middle] && target > nums[right]) {
                right = middle - 1;
                continue;
            }

            if (nums[right] < nums[middle] && target < nums[left]) {
                left = middle + 1;
                continue;
            }

            if (nums[middle] < target) left  = middle + 1;
            else                       right = middle - 1;
        }

        return -1;
    }

}
~~~
