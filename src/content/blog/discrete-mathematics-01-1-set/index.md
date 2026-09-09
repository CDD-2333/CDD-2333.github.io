---
title: '离散数学基础 · 01.1 - 集合'
description: '离散数学基础课程笔记，整理集合的基本概念与常见运算。'
publishDate: '2026-09-08'
tags:
  - Discrete Mathematics
  - Class
  - Math
  - Note
---

离散数学基础整理，自留档，仅记录一些我认为不显而易见的问题。

## 1.1 集合的基本概念

集合的三要素：

- 确定性
- 互异性
- **无序性**

**注 1.1.1**

我们规定，对于任意集合 $A$，都有 $A \notin A$。

**定义 1.1.2**

设 $A, B$ 为两个集合。如果 $A \subseteq B$ 且 $B \subseteq A$，则 $A = B$。

这是 $\subseteq$ 作为偏序关系的体现。

**定义 1.1.4**

不含任何元素的集合称为空集，可以用描述法写作：

$$
\emptyset = \{x \mid x \ne x\}.
$$

**定理 1.1.1**

空集是所有集合的子集。

**证明**

假设结论不正确，则存在集合 $A$，使得 $\emptyset \nsubseteq A$。

由定义可知，存在 $a \in \emptyset$ 且 $a \notin A$，这与 $\emptyset$ 不包含任何元素矛盾。

**推论 1.1.1**

空集是唯一的。

**证明**

假设存在两个不同的空集 $\emptyset_1$ 和 $\emptyset_2$。

由上一定理，$\emptyset_1 \subseteq \emptyset_2$ 且 $\emptyset_2 \subseteq \emptyset_1$，因此 $\emptyset_1 = \emptyset_2$，矛盾。

**定义 1.1.5**

设 $A$ 为集合。称 $A$ 的全体子集构成的集合为 $A$ 的幂集，记作 $P(A)$ 或 $2^A$，即

$$
P(A) = \{X \mid X \subseteq A\}.
$$

这是因为，$n$ 元集合的 $k$ 元子集个数为 $\binom{n}{k}$，且

$$
\sum_{k=0}^{n} \binom{n}{k} = 2^n.
$$

## 1.2 集合的运算

**定义 1.2.1**

$B$ 对 $A$ 的相对补集 $A \setminus B$ 定义为

$$
A \setminus B = \{x \mid x \in A \text{ 且 } x \notin B\}.
$$

**定义 1.2.2**

集合 $A$ 与 $B$ 的对称差 $A \oplus B$ 定义为

$$
A \oplus B = (A \setminus B) \cup (B \setminus A).
$$

一种等价定义是

$$
A \oplus B = (A \cup B) \setminus (A \cap B).
$$

这两种定义是等价的。取 $x \in (A \setminus B) \cup (B \setminus A)$，则

$$
x \in A \text{ 且 } x \notin B
\quad\text{或}\quad
x \in B \text{ 且 } x \notin A.
$$

这也即 $x \in (A \cup B) \setminus (A \cap B)$。反向包含同理可得。

**定义 1.2.3**

在全集为 $E$ 的情形下，定义 $A$ 的绝对补集 $\sim A$ 为

$$
\sim A = \{x \mid x \in E \text{ 且 } x \notin A\}.
$$

**定义**

称由集合构成的集合为集族。

**定义 1.2.4**

设 $\mathcal{A}$ 是一个集族，则 $\mathcal{A}$ 中所有元素的元素组成的集合称为 $\mathcal{A}$ 的广义并，记作 $\bigcup \mathcal{A}$：

$$
\bigcup \mathcal{A} = \{x \mid \exists A \in \mathcal{A},\ x \in A\}.
$$

直观地看，这相当于把所有元素“脱去集合括号”。

**定义 1.2.5**

集族 $\mathcal{A}$ 中所有元素的公共元素构成的集合称为 $\mathcal{A}$ 的广义交，记作 $\bigcap \mathcal{A}$：

$$
\bigcap \mathcal{A} = \{x \mid \forall A \in \mathcal{A},\ x \in A\}.
$$

根据广义交的定义，如果集族是 $\emptyset$，那么不存在 $A \in \mathcal{A}$。由于推理前件不成立时后件恒成立，广义交将无法按上述方式确定。

因此，本文不对空族定义广义交。

## 1.3 集合运算的性质

这里挑选一些不太显然的性质进行阐述和证明，并通过示例练习集合相关的证明。

### 分配律

1. $A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$。

2. $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$。

下面证明第（1）条。

**证明**

先证左侧包含于右侧。设 $x \in A \cup (B \cap C)$。

- 若 $x \in A$，则显然 $x \in (A \cup B) \cap (A \cup C)$。
- 若 $x \in B \cap C$，则 $x \in B$ 且 $x \in C$，同样有 $x \in (A \cup B) \cap (A \cup C)$。

再证右侧包含于左侧。设 $x \in (A \cup B) \cap (A \cup C)$。

- 若 $x \in A$，则显然 $x \in A \cup (B \cap C)$。
- 若 $x \notin A$，则由 $x \in A \cup B$ 和 $x \in A \cup C$ 可知 $x \in B$ 且 $x \in C$，因此 $x \in A \cup (B \cap C)$。

综上，二者相等。

### 德摩根律

1. $A \setminus (B \cup C) = (A \setminus B) \cap (A \setminus C)$。

2. $A \setminus (B \cap C) = (A \setminus B) \cup (A \setminus C)$。

3. $\sim (B \cup C) = \sim B \cap \sim C$。

4. $\sim (B \cap C) = \sim B \cup \sim C$。

下面证明第（2）条。

**证明**

若 $x \in A \setminus (B \cap C)$，则 $x \in A$ 且 $x \notin (B \cap C)$。这也即

$$
x \in A \text{ 且 } (x \notin B \text{ 或 } x \notin C),
$$

所以 $x \in (A \setminus B) \cup (A \setminus C)$。

反之，若 $x \in (A \setminus B) \cup (A \setminus C)$，则 $x \in A$ 且 $x \notin B$ 或 $x \notin C$，也即 $x \notin B \cap C$。因此 $x \in A \setminus (B \cap C)$。

我们还可以利用定义证明更多结论：

1. $A \setminus B = A \cap \sim B$。
2. $A \oplus A = \emptyset$。
3. $A \oplus B = A \oplus C \implies B = C$。

下面证明第（3）条。

**证明**

利用对称差的结合律以及 $A \oplus A = \emptyset$，有

$$
A \oplus (A \oplus B)
= A \oplus (A \oplus C)
\iff (A \oplus A) \oplus B
= (A \oplus A) \oplus C
\iff B = C.
$$

## 1.4 有穷集的计数

**定理 1.4.1（包含排斥原理）**

设 $S$ 为有穷集合，$P_1, \ldots, P_n$ 是 $n$ 条性质，且 $S$ 中的所有元素均有或不具有每条性质 $P_i$。令 $A_i$ 表示具有性质 $P_i$ 的元素构成的子集，则 $S$ 中不具有 $P_1, P_2, \ldots, P_n$ 中任一性质的元素个数为

$$
\left|\overline{A_1} \cap \overline{A_2} \cap \cdots \cap \overline{A_n}\right|
= |S| - \sum_{i=1}^{n} |A_i|
+ \sum_{1 \le i < j \le n} |A_i \cap A_j|
- \cdots + (-1)^n |A_1 \cap A_2 \cap \cdots \cap A_n|.
$$

一个显然的推论是，至少具有一条性质的元素个数为

$$
|S| - \left|\overline{A_1} \cap \overline{A_2} \cap \cdots \cap \overline{A_n}\right|.
$$

### 错排公式

给定 $1, 2, \ldots, n$ 共 $n$ 个位置和 $n$ 个按位匹配的物品 $a_1, a_2, \ldots, a_n$。将这些物品随机排列时，不存在 $a_i$ 与位置 $i$ 相匹配的排列称为错排。

共有 $n$ 个位置时，错排数为

$$
D_n = n!\left(1 - \frac{1}{1!} + \frac{1}{2!} - \cdots + (-1)^n \frac{1}{n!}\right).
$$

错排公式实际上是包含排斥原理的直接应用。
