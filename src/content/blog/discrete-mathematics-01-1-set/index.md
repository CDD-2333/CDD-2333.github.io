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

离散数学基础整理，自留档，仅整理一些个人认为不显而易见的问题。

## 1.1. 集合的基本概念

集合的三要素：确定性、互异性、 **无序性**

注1.1.1. 我们规定，对于任意集合 $A$, 都有 $A \notin A$.

定义1.1.2. 设 $A, B$ 为两个集合，如果 $A \subseteq B$ 且 $B \subseteq A$，则 $A = B$.

这是 $\subseteq$ 作为一个偏序关系的体现。

定义1.1.4. 不含任何元素的集合为 **空集**，可以用描述法写作 $\emptyset = \{x|x \ne x \}$.

定理1.1.1. 空集是所有集合的子集。

**Pf.** 假设结论不正确，则存在集合 $A$，使得
$\emptyset \nsubseteq A$。

由定义得，存在 $a \in \emptyset$ 且 $a \notin A$。

这与 $\emptyset$ 不包含任何元素矛盾。

推论1.1.1. 空集是唯一的。

我们采用反证法。

**Pf.** 假设存在两个不同的空集 $\emptyset_1$ 和 $\emptyset_2$,

由上定理，$\emptyset_1 \subseteq \emptyset_2$ 且 $\emptyset_2 \subseteq \emptyset_2$.

这即 $\emptyset_1 = \emptyset_2$.

定义1.1.5. 设 $A$ 为集合，称 $A$ 的全体子集构成的集合为 $A$ 的幂集，记作 $P(A)$ 或 $2^{A}$. 换句话说，$P(A) = \{X | X \subseteq A \}$.

注：这是由于 $n$ 元集合的 $k (0 \le k \le n)$ 元子集的个数为 $C_n^k$. $\sum_{k=0}^{n} C_n^k = 2^n$.

## 1.2. 集合的运算

定义1.2.1. $B$ 对 $A$ 的 **相对补集** $A - B$ 定义为 $A - B = \{ x | x \in A \text{且} x \notin B \}$.

定义1.2.2. 集合 $A$ 与 $B$ 的 **对称差** $A \oplus B$ 定义为 $A \oplus B = (A - B) \cup (B - A)$. 一种等价定义是 $A \oplus B = (A \cup B) - (A \cap B)$.

而这两种定义是等价的。这是由于，取 $x \in (A - B) \cup (B - A)$，则 $x \in A \text{且} x \notin B$ 或 $x \in B \text{且} x \notin A$. 也即 $x \in (A \cup B) \text{且} x \notin (A \cap B)$.（这里可以使用反证易得） 反之，类似可证。

定义1.2.3. 在全集为 $E$ 的情形下，定义 $A$ 的 **绝对补集** $\sim A$ 为 $\{ x | x \in E \text{且} x \notin A \}$.

定义. 称由集合构成的集合为 **集族**。

定义1.2.4. 设 $\mathcal{A}$ 是一个集族，则 $\mathcal{A}$ 中所有 **元素的元素** 组成的集合称为 $\mathcal{A}$ 的广义并，记作 $\cup \mathcal{A}$.

注：可直观认为这是把所有元素 “脱去集合括号”。

定义1.2.5. 集族 $\mathcal{A}$ 中所有 **元素的公共元素** 构成的集合称为 $\mathcal{A}$ 的广义交，记作 $\cap \mathcal{A}$. 使用描述法表示为 $\{ x | \forall A \in \mathcal{A} \text{均有} x \in A \}$.

注：根据广义交的定义，如果集族是 $\emptyset$，那么 $\nexists A \in \mathcal{A}$. 由于推理前件不成立则后件恒成立，故无法定义广义交。

因此我们不对空族做广义交的定义。

## 1.3. 集合运算的性质

这里我们只挑选一些不太显然的性质进行阐述和证明，或通过某些示例锻炼集合相关的证明能力。

**分配律**

（1）$A \cup (B \cap C) = (A \cup B) \cap (A \cup C)$.

（2）$A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$.

我们证明（1）作为示例.

**Pf.** 设 $x \in A \cup (B \cap C)$, 则 $x \in A \text{或} x \in (B \cap C)$. 若 $x \in A$ 则显然 $x \in (A \cup B)$ 成立。若 $x \in (B \cap C)$ 则 $x \in B$ 且 $x \in C$. 综上这也即 $x \in (A \cup B) \cap (A \cup C)$.

设 $x \in (A \cup B) \cap (A \cup C)$, 则 $x \in (A \cup B)$ 且 $x \in (A \cup C)$. 如果 $x \in A$，则 $x \in A \cup (B \cap C)$ 显然成立。如果 $x \notin A$, 则 $x \in (B \cap C)$. 综上这也即 $x \in A \cup (B \cap C)$.

**德摩根律**

（1）$A - (B \cup C) = (A - B) \cap (A - C)$.

（2）$A - (B \cap C) = (A - B) \cup (A - C)$.

（3）$\sim (B \cup C) = \sim B \cap \sim C$.

（4）$\sim (B \cap C) = \sim B \cup \sim C$.

我们证明（2）作为示例。

**Pf.** 若 $x \in A - (B \cap C)$, 则 $x \in A \text{且} x \notin (B \cap C)$. 这也即 $x \in A \text{且} x \notin B \text{且} x \notin C$. 也就是 $x \in (A - B) \cup (A - C)$.

反之，若 $x \in (A - B) \cup (A - C)$, 则 $x \in A \text{且} x \notin B \text{或} x \notin C$. 也即 $x \in A \text{且} x \notin (B \cap C)$.

我们可以利用定义证明更多二级结论。例如，

（1）	A \setminus B = A \cap \sim B.
（2）	A \oplus A = \emptyset.
（3）	A \oplus B = A \oplus C \implies B = C.

这里我们证明结论3.

**Pf.** $A \oplus (A \oplus B) = A \oplus (A \oplus C) \iff (A \oplus A) \oplus B = (A \oplus A) \oplus C \iff B = C$.

## 1.4. 有穷集的计数

定理1.4.1.（包含排斥原理）

设 $S$ 为有穷集合，$P_1 \cdots P_n$ 是 $n$ 条性质且 $S$ 中的所有元素均有或不具有性质 $P_i$. 令 $A_i$ 表示具有性质 $P_i$ 的元素构成的子集。则 $S$ 中不具有 $P_1, P_2, \cdots P_n$ 中任一性质的元素个数为：

$\boxed{|\bar{A_1} \cap \bar{A_2} \cap \cdots \cap \bar{A_n}| = |S| - \sum_{i=1}^{n} |A_i| + \sum_{1 \le i < j \le n} |A_i \cap A_j| - \cdots + (-1)^n |A_1 \cap A_2 \cap \cdots \cap A_n|}$.

一个显然的推论是，至少有一条性质的元素个数为 $|S| - $ 元素个数.

我们给出一个实际应用示例。

**错排公式** 给定 $1, 2, \cdots , n$ 共 $n$ 个位置和 $n$ 个按位匹配的物品 $a_1, a_2, \cdots ,a_n$, 将这些物品随机排列，则 $\nexists a_i$ 与位置 $i$ 相匹配的排列方法称为错排。

计算共有 $n$ 个位置情况下的错排方法数对应的递推式是

$\boxed{D_n = n! [1 - \frac{1}{1!} + \frac{1}{2!} - \cdots + (-1)^n \frac{1}{n!}]}$.

我们不难看出，错排公式实际上是包含排斥原理的直接应用。
