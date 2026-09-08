---
title: '数据结构与算法A · 01 - 排序'
description: '对手写代码的锻炼，对计算概论A的补充'
publishDate: '2026-09-06 22:32:22'
tags:
  - Algorithm
  - Class
  - Note
---

~~由于计算概论A可以使用STL蒙混过关，因此本人手写各排序算法能力为0. ~~在这篇文章中，我将尽力不借助生成式人工智能手写复习各种排序算法并加以解释。

# 朴素认知

本小节介绍 $O(n^2)$ 的排序算法。

1. 冒泡排序

顾名思义，冒泡排序不断通过交换相邻两个反序元素达成排序。这个过程可以类比泡泡从水底浮出水面，因而得名。

- 算法原理

这里我们假定排序的数组从左到右按序。

第 $k$ 轮排序将数组的第 $k$ 大/小元素排序到正确位置。因此在进行第 $k$ 轮排序时，前 $n-k+1$ 个元素需要调整顺序。

调整顺序的过程：第 $i$ 与 $i+1$ 个元素比较大小，反序则调换位置。

不难看出冒泡排序所作的交换次数最多为 $\frac{n(n-1)}{2}$ ，是 $O(n^2)$ 的。

- 代码实现

```cpp
for (int i = 0; i < n-1; i++) //遍历数组
    for (int j = 0; j < n-1-i; j++) //第k个元素只对前n-k+1个进行操作
        if (arr[j] > arr[j+1]) swap(arr[j], arr[j+1]);
```

事实上，我们还可以进行适当剪枝。注意到如果某一轮 **完全** 没有交换发生，则数组已经有序。

```cpp
for (int i = 0; i < n - 1; i++){
	bool swapped=False;
	for (int j = 0; j < n-1-i; j++){
		if (arr[j] > arr[j+1]){
			swap(arr[j], arr[j+1]);
			swapped = True;
		}
	}
	if (!swapped) break;
}
```

2. 选择排序

将数组分割为两个部分，一部分已经完成排序，另一部分尚未完成。

- 算法原理

为了将完成排序的区间扩展到 $[0, k+1]$ ，我们需要：

使 $[0, k]$ 内元素有序

找到原位于 $[k+1, n)$ 中的最大/小元素并调换到 $k+1$ 位来

不难看出选择排序进行比较操作的次数是与冒泡排序最坏情况相同的。

- 代码实现

```cpp
for (int i = 0; i < n; i++){
	int max_idx = i;
	for (int j = i+1; j < n; j++)
		if (arr[j] > arr[max_idx]) max_idx = j;
	arr[i] = arr[max_idx];
}
```

3. 插入排序

基本思想与选择排序近似，但细节略有不同。选择排序使程序对于任意输入序列均是 $O(n^2)$ 复杂度的。为此我们可以改进。

- 算法原理

首先初始化有序区间为 $[0,0]$，然后重复下列行为：

从无序区间中取出第一个元素，将有序区间中元素与其比较，找到按序排列后其在有序区间中的位置，将其后剩余元素后移。

这样，最好情况下算法可以达到 $O(n)$，但最差情况下，依然是 $O(n^2)$ 的。这是由于在最坏情况下，算法和选择排序等价。

- 代码实现

```cpp
for (int i = 0; i < n - 1; i++){
	int j = i + 1; //循环变量从目标值索引开始
	int temp = arr[i+1]; //由于后续涉及数组移位，必须取出目标值
	while (j > 0 && arr[j-1] < temp){ //不越界且按序优于目标值
		arr[j] = arr[j-1]; //则将有序区间剩余部分后移一位
		j--;
	}
	arr[j] = temp; //并在正确位置插入目标值
}
```

4. 希尔排序

插入排序虽然可以改进较差情况下的时间复杂度，但平均时间复杂度仍然较高。如何加速？

注意到，插入排序每次只会与相邻元素比较并交换。而对于顺序良好情况，插入排序速度会显著加快，因为对于每个元素，都只需要为数不多的比较便可归位。

希尔排序（Shell Sort）试图从此处入手加快排序速度。其核心思想是对数据进行有间隔地分组，对每组进行插入排序以尽快消除间隔很远的逆序对。

- 算法原理

*注意 **间隔的选取并没有固定规则与绝对优劣**，但有一些相对较快的步长序列如Hibbard序列、Sedgewick序列等。*

不断重复下列过程：

首先初始化间隔并将数组按间隔分组。

然后在每个组内做插入排序。

最后调整间隔。

注意最后一次排序的间隔必须为1.

- 代码实现

```cpp
int len = size / 2; //初始化间隔
while (len > 0){
	for (int i = len; i < size; i++){ //每个组的第一个元素是初始的有序区间
		tmp = arr[i];
		j = i;
		while (j >= len && arr[j-len] > arr[i]){ //在组内进行插入排序
			swap(arr[j-len], arr[i]);
			j -= len;
		}
		arr[j] = tmp; //移入正确位置
		len /= 2; //以特定方式递减间隔
	}
}
```

上述选取间隔的方式是最原始且最差的。这种方式会导致希尔排序接近 $O(n^2)$. 通过优化间隔的选取方式，最高可以达到近似 $O(n\log{n})$.

# 分治的引入

1. 归并排序

前述几种算法的复杂度均在 $O(n^2)$ 上下徘徊。我们期望把指数增长替换为某些更平缓的增长。一个很自然的思考方向是努力将指数缩小，但我们知道，如果排序依赖比较而不是某些自然顺序，由于至少需要遍历一次全部数据，因此完全不可能到达 $O(n)$ 或更低量级。

另一个思考方向则是，把指数增长替换为对数增长。什么情况下才会出现 $\log_{2}$ 等对数呢？显然是不断以二分/ $n$ 分的方式缩小问题的规模。由此我们试图引入分治解决问题。

归并排序（Merge Sort）是一种基于分治思想操作数组，先将数组二分直至单个元素，然后再依次按序组合直至有序的算法。

- 算法原理

归并排序主要由两个部分组成：

1. 分解

首先找到数组中间位置 $mid$, 将数组划分为两部分 $left_arr$ 和 $right_arr$.

然后对两部分执行如上操作并递归直至 $len = 1$.

2. 合并

维护两个指针 $left_ptr$ 和 $right_ptr$. 初始二者分别指向 $left_arr$ 和 $right_arr$ 的首地址. 根据排序规则比较两侧指针指向元素的大小关系，然后依次把它们加入更大的数组中直到 $left_arr$ 和 $eight_arr$ 均指向末尾。其中如果某一指针已经指向末尾，则直接将另一侧的所有元素加入结果数组即可。

然后对其他小数组执行如上操作并递归直至 $len = len_orig$.

3. 复杂度计算

对于分解部分，总操作次数约为 $1 + 2 + 4 + \cdots + 2^{\log_{2}n} = 2n$。对于合并部分，总操作次数是线性的，因为只会发生不重复的单次比较和单次添加。这两部分的复杂度是相乘关系，因为每一层都需要进行合并操作。复杂度只计高次项，是 $O(n\log{n})$ 的。

- 代码实现

在编写归并排序代码时，应当注意以下几点：1. 递归边界条件是什么？ 2. 递归返回什么？类型是什么？ 3. 如何把分解和合并在同一个函数中连接起来？

这其中最难的是第三点，因为分解只需要把大数组分解为左右两部分，但合并时一个部分数组并不知道 “另一侧” 的部分数组信息。这需要我们想清楚函数之间的调用关系链。

```cpp
vector<int> merge (vector<int> left_arr, vector<int> right_arr){
	int left_ptr = 0;
	int right_ptr = 0;
	vector<int> ret;

	while (left_ptr < left_arr.size() && right_ptr < right_arr.size()){ //边界条件：有一侧指针已经指向末尾
		if (left_arr[left_ptr] > right_arr[right_ptr]){ //利用双指针通过比较维护结果数组
			ret.push_back(left_arr[left_ptr]);
			left_ptr++; //移动指针
		}else{
			ret.push_back(right_arr[right_ptr]);
			right_ptr++;
		}
	}

	if(left_ptr == left_arr.size()){ //如果左侧指针已经指向末尾，那么将右侧数组剩余元素全部加入结果数组（更小的数组已经有序），反之同理
		while(right_ptr < right_arr.size()){
			ret.push_back(right_arr[right_ptr++]);
		}
	}else if(right_ptr == right_arr.size()){
		while(left_ptr < right_arr.size()){
			ret.push_back(left_arr[left_ptr++]);
		}
	}

	return ret;
}

vector<int> mergeSort (vector<int> arr){
	if (arr.size() <= 1) return arr; //递归终止条件

	int mid = arr.size() / 2; //二分为 [0, mid) 和 [mid, size)
	vector<int> left_arr;
	vector<int> right_arr;
	for (int i = 0; i < mid; i++) left_arr.push_back(arr[i]);
	for (int i = mid; i< arr.size(); i++) right_arr.push_back(arr[i]); //维护左右数组

	mergeSort(left_arr);
	mergeSort(right_arr); //递归操作左右数组

	return merge(left_arr, right_arr); //合并数组
}
```

2. 快速排序

快速排序（Quick Sort）基于分治思想和双指针实现。

和归并排序的一种很类似的思考方式是，我们期望找到一种分割方式，使得某元素的一侧全部大于它而另一侧全部小于它。这样便有了部分有序性，也给予我们递归的条件。

- 算法原理

首先确定一个基准元素，可以采用首元素或随机取样。

然后维护两个初始状态下分别指向首尾的指针。重复向内移动直至左指针找到第一个大于（若升序排列）基准元素的元素、右指针找到第一个小于的元素，交换二者。

继续向内移动并重复交换过程直至二者相遇。把基准元素插入相遇位置。

递归处理其左侧和右侧的两部分数组。

- 代码实现

事实上，对于c/cpp而言，插入元素部分过于繁琐了，因此我们采用python演示 :(

```python
def quicksort(arr):
	if len(arr) <= 1:return arr

	pivot = arr[0]
	left_ptr = 0
	right_ptr = len(arr) - 1
	while left_ptr < right_ptr:
		while left_ptr < right_ptr and arr[right_ptr] < pivot: right_ptr-=1
		while left_ptr < right_ptr and arr[left_ptr] > pivot: left_ptr+=1
		arr[left_ptr], arr[right_ptr] = arr[right_ptr], arr[left_ptr]

	arr[left_ptr], arr[0] = arr[0], arr[right_ptr]

	left_arr = arr[:left_ptr], right_arr=[left_ptr:]

	return quicksort(left_arr) + pivot + quicksort(right_arr)
```

3. 堆排序

堆排序（Heap Sort）依赖堆这种结构。堆是一种特殊的数据结构，其是有良好顺序的完全二叉树。

堆分为大顶堆和小顶堆两种，前者任意节点值均 $\ge$ 子节点值，后者任意节点值均 $\le$ 子节点值。

当使用数组来存储 **完全二叉树** 时，我们规定：

对于索引为 $i$ 的父节点，其左孩子索引为 $2i + 1$，右孩子索引为 $2i + 2$

对于索引为 $i$ 的节点，其父节点索引为 $\lfloor \frac{2i-1}{2} \rfloor$

- 堆的基本操作

1. 建堆：常使用类封装。初始化时，使用一个空数组即可。

2. 访问堆顶元素：对于大顶堆而言，即等价于取最大值，反之同理。

3. 插入元素：由于完全二叉树数组表示的性质，仅在数组后 `push_back` 即可。为维持堆的有序性，插入后需要进行一些交换操作。

我们已了解堆的子节点与父节点间的递推公式，因而可以简单将子节点持续与父节点交换直至堆的有序性被满足或到达根节点。

4. 删除元素：删除堆顶元素并调整堆的结构，本过程分为三个部分：首先交换堆顶与堆底元素，然后删除新堆底。最后调整堆结构。

调整过程中，新堆顶需要重复执行下述过程：与子节点中较大者比较 → 若不满足堆序则交换，反之结束过程。

- 堆插入/删除的时间复杂度

由于堆的完全二叉性，当向元素个数为 $n$ 的堆中加入一个新元素时，我们最多只需要进行 $\log_{2}n$ 次交换操作。

同理，对于堆的删除，调整堆最多也只需要 $\log_{2}n$ 次交换。

- 算法原理

	堆排序主要分为两部分：建堆和提取最大值

	1. 建堆：把数组视作一棵完全二叉树，从最后一个非叶子节点开始自底向上进行插入操作时的调整过程。最终构建大顶堆/小顶堆。

	这里时间复杂度是 $O(n)$ 的，因为每一层有 $2^k$ 个节点，每个节点最差情况下涉及 $\log_{2}(n - k)$ 次交换操作，求和可得是 $O(n)$ 复杂度的操作。

	2. 提取最大值：不断重复执行删除堆顶 → 调整堆结构的过程直至堆清空。

	这里时间复杂度是 $O(n\log{n})$ 的，因为考虑第 $k$ 次提取最大值时的最多调整次数是 $\log_{2}{(n-k+1)}$，因此总复杂度是 $\sum_{k=0}^{n-1} log_{2}{k} \approx n\log{n}$. 利用Stirling公式并舍去低阶项不难发现算法是 $O(n\log{n})$ 的。

- 代码实现

```cpp
class Heap{
	vector<int> maxheap;

	Heap(vector<int> arr):maxheap(arr){}

	void shift_down(int i, int size){
		while (2 * i + 1 < n){

		}
	}
}
```

需要注意的是，STL的 `<algorithm>` 中，`std::sort` 并不是以上算法的任意一种，而是基于快速排序、堆排序和插入排序共同作用的 “内省排序”. 而 `<list>` 中的 `std::list::sort` 则是归并排序。
