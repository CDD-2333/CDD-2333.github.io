---
title: 'ICS · Lab2 - Bomblab'
description: 'ICS Lab2 Bomblab 回顾'
publishDate: '2026-10-02'
tags:
  - ICS
  - Class
  - Note
---

这篇文章是 2026 秋 ICS（计算机系统导论）Lab2 Bomblab 回顾。本lab主要是对书上第3章的理解性检测。目的是在没有阅读高级代码的前提下，通过阅读汇编代码预测程序行为，从而阻止程序运行炸弹函数。

当然，本Lab还有一个很重要的作用是，让我们意识到使用gdb调试程序和获取程序中特定信息的重要性。

Lab2由6个phase和1个secret_phase组成，完成前6个phase即可获得满分。完成secret_phase不会获得额外加分，但可以抵消一定的炸弹爆炸次数（也就是触发函数explode_bomb的次数）。不过，我们可以通过在explode_bomb函数处设置断点阻止其运行，因此理论上一定可以无伤完成本Lab。

每一个phase对应一个谜题，我们需要通过阅读汇编构造符合题目要求的输入。在进行本Lab前最好将书中3.2-3.10节的全部内容完全熟读并理解。

本Lab名义上需要在xlab环境进行，笔者没有在wsl中测试，但据传实际上也可行。不需要提交，phase的通过/bomb信息会被同步发送到autolab服务器完成自动评分。需要注意的是，与后面的attack lab相似，每次下载handout对应的文件都不相同，一定程度上减少了直接抄袭的可能性。

# 预备知识——相关工具

## GDB

GDB是程序调试器，可以在程序中设置断点、检查特定位置寄存器值、变量值等。一些常用的GDB命令如下表：

| 参数 | 全名 | 描述 |
| --- | --- | --- |
| r | run | 运行程序，直到断点或程序结束为止 |
| b | break | 设置断点，参数是特定地址，地址的表达方式与汇编类似 |
| q | quit | 退出GDB |
| ni | next instruction | 执行下一条指令但不会进入新的过程 |
| si | step instruction | 执行下一条指令并进入新的过程（若需要）|
| c | continue | 继续执行 |
| p | print | 打印变量的值 |
| x | examine | 检查特定位置内存的值 |
| j | jump | 跳转到程序特定位置，参数是地址 |
| disas | disassemble | 反汇编 |
| info registers | | 打印全部寄存器的值和状态 |
| d | delete | 删除某断点 |

对于随后将要频繁使用的 `p/x` 这两个参数，可选的参数如下：

| 参数 | 描述 |
| --- | --- |
| 数字 | 随后需要检查的数据的单位数 |
| c/d/x | 分别代表将以字符/十进制/十六进制形式检查数据 |
| b/h/w/g | 分别代表将以1字节/2字节/4字节/8字节为单位检查数据 |

特别地，参数 `s` 代表需要以C风格字符串的形式检查，如果使用了 `x/b` `x/h` `x/w` `x/g`这样的参数，则单位会被修改，直到下次修改。

示例：

- `p $rax`：打印 `%rax` 的值
- `p/d $rsp`：以十进制打印 `%rsp` 的值
- `x/2x $rsp`：检测以 `%rsp` 为首地址的2个单位内存中的数据，以十六进制打印
- `x/g $rsp` ：检测以 `%rsp` 为首地址的8字节内存中的数据

如果存在需要多次重复的gdb设置，我们可以使用 `touch .gdbinit` 创建gdb配置文件并在其中写入每次启动gdb时都需要使用的gdb指令，例如 `b explode_bomb`，从而简化配置过程。

以下以笔者完成的bomb237为例。

## 反汇编

在开始之前，我们首先使用 `objdump` 进行反汇编以获取汇编代码。

```bash
objdump -d bomb > bomb.asm
```

## 重定向输入

我们可以使用重定向的方式代替每次键入。只需要新建文本文档 `touch qwerty.txt` 并把输入写入这个文档，然后在.gdbinit中添加

```
set args qwerty.txt
``` 

即可以把输入重定向到该文档。

# Phase 1

相关代码如下

```asm
0000000000001571 <phase_1>:
    1571:	48 83 ec 08          	sub    $0x8,%rsp
    1575:	48 8d 35 9c 1c 00 00 	lea    0x1c9c(%rip),%rsi        # 3218 <_IO_stdin_used+0x218>
    157c:	e8 e1 04 00 00       	call   1a62 <strings_not_equal>
    1581:	85 c0                	test   %eax,%eax
    1583:	75 05                	jne    158a <phase_1+0x19>
    1585:	48 83 c4 08          	add    $0x8,%rsp
    1589:	c3                   	ret
    158a:	e8 32 07 00 00       	call   1cc1 <explode_bomb>
    158f:	eb f4                	jmp    1585 <phase_1+0x14>

0000000000001a62 <strings_not_equal>:
    1a62:	41 54                	push   %r12
    1a64:	55                   	push   %rbp
    1a65:	53                   	push   %rbx
    1a66:	48 89 fb             	mov    %rdi,%rbx
    1a69:	48 89 f5             	mov    %rsi,%rbp
    1a6c:	e8 dd ff ff ff       	call   1a4e <string_length>
    1a71:	41 89 c4             	mov    %eax,%r12d
    1a74:	48 89 ef             	mov    %rbp,%rdi
    1a77:	e8 d2 ff ff ff       	call   1a4e <string_length>
    1a7c:	41 39 c4             	cmp    %eax,%r12d
    1a7f:	74 12                	je     1a93 <strings_not_equal+0x31>
    1a81:	b8 01 00 00 00       	mov    $0x1,%eax
    1a86:	5b                   	pop    %rbx
    1a87:	5d                   	pop    %rbp
    1a88:	41 5c                	pop    %r12
    1a8a:	c3                   	ret
    1a8b:	48 83 c3 01          	add    $0x1,%rbx
    1a8f:	48 83 c5 01          	add    $0x1,%rbp
    1a93:	0f b6 03             	movzbl (%rbx),%eax
    1a96:	84 c0                	test   %al,%al
    1a98:	74 0c                	je     1aa6 <strings_not_equal+0x44>
    1a9a:	38 45 00             	cmp    %al,0x0(%rbp)
    1a9d:	74 ec                	je     1a8b <strings_not_equal+0x29>
    1a9f:	b8 01 00 00 00       	mov    $0x1,%eax
    1aa4:	eb e0                	jmp    1a86 <strings_not_equal+0x24>
    1aa6:	b8 00 00 00 00       	mov    $0x0,%eax
    1aab:	eb d9                	jmp    1a86 <strings_not_equal+0x24>
```

回忆一些基本知识点，调用过程时参数的存放顺序依次为 `%rdi` $\to$ `%rsi` $\to$ `%rdx` $\to$ `%rcx` $\to$ `%r8` $\to$ `%r9` $\to$ 栈上。

函数 `phase_1` 首先对齐了栈指针，然后调用 `strings_not_equal`。虽然这个函数的代码较长，但通过两次 `call 1a4e <string_length>` 和 `je <strings_not_equal>` 我们可以发现 `1a7f` 前的代码用于比较两个参数字符串的长度。如果不相等，则不发生跳转，返回 `true`。

然后函数跳转到 `0x1a93`，由于入口处执行了 `mov %rdi, %rbx`，因此这里 `movzbl (%rbx),%eax` 的目的是加载首个参数的第一个字符到 `%al` 中，然后检测是否为 `\0`。如果是，那么字符串已经到了结尾，比较结束，直接返回 `false`。

如果不是，那么把它与 `(%rbp)` 相比较，从入口处的 `mov %rsi,%rbp` 不难退出这是比较两个参数的第一个字符。然后的比较逻辑便是移动指针 $\to$ 不等返回，相等继续。

回到 `phase_1`，这个函数的语义便可以得出了。函数会比较输入字符串和调用前已经存放在 `%rdi` 中的目标字符串并进行匹配，如果不相同会触发炸弹，反之解决这个phase。

因此我们只需要在 `phase_1+0xb` 处设置断点并使用gdb的 `p/s $rdi` 获取目标字符串，再作为输入即可通过。

~~ 笔者很喜欢自己分到的 bomb 中的这句话，尤其是此刻——这篇 blog 刚刚写完，哲导课也恰好讲到了心灵哲学。：Love is a program that science and logic can never explain.~~

# Phase 2

相关代码如下

```asm
0000000000001591 <phase_2>:
    1591:	53                   	push   %rbx
    1592:	48 83 ec 20          	sub    $0x20,%rsp
    1596:	48 89 e6             	mov    %rsp,%rsi
    1599:	e8 8e 07 00 00       	call   1d2c <read_six_numbers>
    159e:	83 3c 24 00          	cmpl   $0x0,(%rsp)
    15a2:	78 07                	js     15ab <phase_2+0x1a>
    15a4:	bb 01 00 00 00       	mov    $0x1,%ebx
    15a9:	eb 0a                	jmp    15b5 <phase_2+0x24>
    15ab:	e8 11 07 00 00       	call   1cc1 <explode_bomb>
    15b0:	eb f2                	jmp    15a4 <phase_2+0x13>
    15b2:	83 c3 01             	add    $0x1,%ebx
    15b5:	83 fb 05             	cmp    $0x5,%ebx
    15b8:	7f 1a                	jg     15d4 <phase_2+0x43>
    15ba:	48 63 c3             	movslq %ebx,%rax
    15bd:	8d 53 ff             	lea    -0x1(%rbx),%edx
    15c0:	48 63 d2             	movslq %edx,%rdx
    15c3:	89 d9                	mov    %ebx,%ecx
    15c5:	03 0c 94             	add    (%rsp,%rdx,4),%ecx
    15c8:	39 0c 84             	cmp    %ecx,(%rsp,%rax,4)
    15cb:	74 e5                	je     15b2 <phase_2+0x21>
    15cd:	e8 ef 06 00 00       	call   1cc1 <explode_bomb>
    15d2:	eb de                	jmp    15b2 <phase_2+0x21>
    15d4:	48 83 c4 20          	add    $0x20,%rsp
    15d8:	5b                   	pop    %rbx
    15d9:	c3                   	ret

0000000000001d2c <read_six_numbers>:
    1d2c:	48 83 ec 08          	sub    $0x8,%rsp
    1d30:	48 89 f2             	mov    %rsi,%rdx
    1d33:	48 8d 4e 04          	lea    0x4(%rsi),%rcx
    1d37:	48 8d 46 14          	lea    0x14(%rsi),%rax
    1d3b:	50                   	push   %rax
    1d3c:	48 8d 46 10          	lea    0x10(%rsi),%rax
    1d40:	50                   	push   %rax
    1d41:	4c 8d 4e 0c          	lea    0xc(%rsi),%r9
    1d45:	4c 8d 46 08          	lea    0x8(%rsi),%r8
    1d49:	48 8d 35 a4 19 00 00 	lea    0x19a4(%rip),%rsi        # 36f4 <transition_table+0x334>
    1d50:	b8 00 00 00 00       	mov    $0x0,%eax
    1d55:	e8 06 f4 ff ff       	call   1160 <__isoc99_sscanf@plt>
    1d5a:	48 83 c4 10          	add    $0x10,%rsp
    1d5e:	83 f8 05             	cmp    $0x5,%eax
    1d61:	7e 05                	jle    1d68 <read_six_numbers+0x3c>
    1d63:	48 83 c4 08          	add    $0x8,%rsp
    1d67:	c3                   	ret
    1d68:	e8 54 ff ff ff       	call   1cc1 <explode_bomb>
```

首先分析 `phase_2`，进入后依然是把callee-saved reg压栈，减栈指针以分配临时变量存储空间，然后把新的栈顶地址存入第二个参数对应的寄存器，调用 `read_six_numbers`。

进入 `read_six_numbers` 后，我们需要回忆 `sscanf` 的参数形式，第一个参数是输入字符串，第二个参数则是控制输入格式的字符串，随后的若干个参数分别对应需要写入的变量的地址。综合参数顺序和寄存器的对应关系，我们不难看出，各个寄存器中存放的地址，是以旧 `%rsi` 也就是外层函数的 `%rsp` 即新栈顶为首地址的 `int` 型数组上的每个元素的地址。而之所以会有两次压栈，是由于除开6个需要输入的整数外scanf还有两个参数，已经超过了6个参数寄存器的最大值，因此7、8号参数需要放在栈上。最后，由于 `scanf` 的返回值是成功读入的参数个数，如果输入数字个数 $\le 5$，则会跳转至 `explode_bomb`。

回到 `phase_2` 中，我们把输入的数组记为 `int num[6]`。程序执行到 `0x159e` 处，首先判断 `num[0]` 是否非负，如果为负，爆炸。然后把 `%ebx` 设置为1并跳转到一个紧跟在 `add` 语句后的 `cmp+jg`处，这使我们猜测到这里的实际语义可能是某种循环语句。

事实确实如此，在这个循环中，`%ebx` 充当索引的角色。程序首先会把存储循环索引的 `%ebx` 放进 `%rax`（注意同一寄存器复用时意义会发生改变，这里其意义可不是返回值）并将 `%edx` 设置为 `%ebx-1`。然后通过两行的传送和计算，把 `%ecx` 设置为 `num[%ebx-1]+%ebx` ，此后再判断 `num[%ebx]` 与 `%ecx` 是否相等，如果不相等，爆炸；反之，跳到 `15b2` 也就是索引自增语句继续执行循环。

我们可以把其等价的C代码还原出来：
```c
void phase_2(){
	sscanf(input,"%d...%d\n",&num[0],...&num[5]);
	if(num[0]<0) explode_bomb();
	for(int i=1;i<=5;i++){
		if(num[i]!=num[i-1]+i) explode_bomb();
	}
	return;
}
```

因此符合条件的输入应当满足以下条件：总共六个递增整数值，第一个非负，此后递增量分别为1、2、3、4、5.

# Phase 3

从这个phase开始，代码量和理解难度均骤然提升。代码如下

```asm
00000000000015da <phase_3>:
    15da:	48 83 ec 18          	sub    $0x18,%rsp
    15de:	48 8d 4c 24 08       	lea    0x8(%rsp),%rcx
    15e3:	48 8d 54 24 0c       	lea    0xc(%rsp),%rdx
    15e8:	48 8d 35 11 21 00 00 	lea    0x2111(%rip),%rsi        # 3700 <transition_table+0x340>
    15ef:	b8 00 00 00 00       	mov    $0x0,%eax
    15f4:	e8 67 fb ff ff       	call   1160 <__isoc99_sscanf@plt>
    15f9:	83 f8 01             	cmp    $0x1,%eax
    15fc:	7e 1f                	jle    161d <phase_3+0x43>
    15fe:	83 7c 24 0c 07       	cmpl   $0x7,0xc(%rsp)
    1603:	0f 87 81 00 00 00    	ja     168a <phase_3+0xb0>
    1609:	8b 44 24 0c          	mov    0xc(%rsp),%eax
    160d:	48 8d 15 6c 1d 00 00 	lea    0x1d6c(%rip),%rdx        # 3380 <_IO_stdin_used+0x380>
    1614:	48 63 04 82          	movslq (%rdx,%rax,4),%rax
    1618:	48 01 d0             	add    %rdx,%rax
    161b:	ff e0                	jmp    *%rax
    161d:	e8 9f 06 00 00       	call   1cc1 <explode_bomb>
    1622:	eb da                	jmp    15fe <phase_3+0x24>
    1624:	b8 00 00 00 00       	mov    $0x0,%eax
    1629:	2d 4e 02 00 00       	sub    $0x24e,%eax
    162e:	05 57 01 00 00       	add    $0x157,%eax
    1633:	83 e8 5f             	sub    $0x5f,%eax
    1636:	83 c0 5f             	add    $0x5f,%eax
    1639:	83 e8 5f             	sub    $0x5f,%eax
    163c:	83 c0 5f             	add    $0x5f,%eax
    163f:	83 e8 5f             	sub    $0x5f,%eax
    1642:	83 7c 24 0c 05       	cmpl   $0x5,0xc(%rsp)
    1647:	7f 06                	jg     164f <phase_3+0x75>
    1649:	39 44 24 08          	cmp    %eax,0x8(%rsp)
    164d:	74 05                	je     1654 <phase_3+0x7a>
    164f:	e8 6d 06 00 00       	call   1cc1 <explode_bomb>
    1654:	48 83 c4 18          	add    $0x18,%rsp
    1658:	c3                   	ret
    1659:	b8 aa 00 00 00       	mov    $0xaa,%eax
    165e:	eb c9                	jmp    1629 <phase_3+0x4f>
    1660:	b8 00 00 00 00       	mov    $0x0,%eax
    1665:	eb c7                	jmp    162e <phase_3+0x54>
    1667:	b8 00 00 00 00       	mov    $0x0,%eax
    166c:	eb c5                	jmp    1633 <phase_3+0x59>
    166e:	b8 00 00 00 00       	mov    $0x0,%eax
    1673:	eb c1                	jmp    1636 <phase_3+0x5c>
    1675:	b8 00 00 00 00       	mov    $0x0,%eax
    167a:	eb bd                	jmp    1639 <phase_3+0x5f>
    167c:	b8 00 00 00 00       	mov    $0x0,%eax
    1681:	eb b9                	jmp    163c <phase_3+0x62>
    1683:	b8 00 00 00 00       	mov    $0x0,%eax
    1688:	eb b5                	jmp    163f <phase_3+0x65>
    168a:	e8 32 06 00 00       	call   1cc1 <explode_bomb>
    168f:	b8 00 00 00 00       	mov    $0x0,%eax
    1694:	eb ac                	jmp    1642 <phase_3+0x68>
```

在上一个phase中，我们分析了函数 `sscanf` 的传参方式。这个phase中，类比可得，只有两个输入的 `int/unsigned int` 型参数分别需要存放在 `%rsp+12` 和 `%rsp+8`上，下文中方便起见我们分别记作 `a` 和 `b`。

直接分析到 `0x15fe` 处，这个比较语句的行为是当把 `a` 解释为无符号整数后，`a>7` 时爆炸。然后的 `lea` 加载了某一个奇怪的地址到 `%rdx` 中。通过 `movslq` 和 `add` 的具体形式，我们猜测变量 `a` 的作用是作为某 `int/unsigned` 数组的索引，然后的两条指令应当是 `%rax+=%rdx[i]` 并以这时 `%rax` 中的值为目标跳转。

回忆课上所学，这种形式使我们想起 `switch` 语句的跳转表。（跳转到基地址+偏移量处并执行情况对应的某些语句）

但是，如果我们直接Ctrl+F试图查询3380，会发现根本没有匹配。那么应该怎么才能确定索引和跳转目的地的对应关系呢？我们仍然需要使用gdb.

```bash
x/8xw $rdx
```

这个语句的意义是十六进制打印以 `%rdx` 为首地址的8个4字节单位。根据跳转表的定义，也就是四个相对于跳转表首地址的偏移量。输出结果大致形如：

```
FFFFE2D9 FFFFE2A4 FFFFE2E0 FFFFE2E7 FFFFE2EE FFFFE2F5 FFFFE2FC FFFFE303
```

然后我们可以进行补码加法一一运算出每个索引对应的目标地址：

```
0x1659 0x1624 0x1660 0x1667 0x166e 0x1675 0x167c 0x1683
```

回到原函数。从 `0x1649` 处的 `cmp` 不难看出，如果参数 `b` 与分支运算结果不相等，则会爆炸。因此我们需要逐一分析这些跳转地址对应的语义。为方便起见，以下我们使用十进制表示数值。

Case 0：把 `%rax` 设置为 `170`。然后跳转到 `0x1629`，减去 `590`，加上 `343`，减去 `95`。即得到 `-172`.

Case 1：把 `%rax` 设置为 `0`（以下初始值都是，省略），然后进行 `-590+343-95`，得到 `-342`.

Case 2：初始化后跳转到 `0x162e`，进行 `+343-95` 得到 `248`.

Case 3：初始化后跳转到 `0x1633`，进行 `-95` 得到 `-95`.

Case 4：初始化后跳转到 `0x1636`，最终还是 `0`.

Case 5：跳转到 `0x1639`，最终是 `-95`.

Case 6：跳转到 `0x163c`，最终是 `0`.

Case 7：跳转到 `0x163f`，最终是 `-95`.

综上所述，本题所需要的输入是：参数1为0-7内的整数，参数2为对应该整数的Case的运算结果。

# Phase 4

相关代码如下

```asm
00000000000016d3 <phase_4>:
    16d3:	48 83 ec 18          	sub    $0x18,%rsp
    16d7:	48 8d 4c 24 08       	lea    0x8(%rsp),%rcx
    16dc:	48 8d 54 24 0c       	lea    0xc(%rsp),%rdx
    16e1:	48 8d 35 18 20 00 00 	lea    0x2018(%rip),%rsi        # 3700 <transition_table+0x340>
    16e8:	b8 00 00 00 00       	mov    $0x0,%eax
    16ed:	e8 6e fa ff ff       	call   1160 <__isoc99_sscanf@plt>
    16f2:	83 f8 02             	cmp    $0x2,%eax
    16f5:	75 0d                	jne    1704 <phase_4+0x31>
    16f7:	8b 44 24 0c          	mov    0xc(%rsp),%eax
    16fb:	85 c0                	test   %eax,%eax
    16fd:	78 05                	js     1704 <phase_4+0x31>
    16ff:	83 f8 0e             	cmp    $0xe,%eax
    1702:	7e 05                	jle    1709 <phase_4+0x36>
    1704:	e8 b8 05 00 00       	call   1cc1 <explode_bomb>
    1709:	ba 0e 00 00 00       	mov    $0xe,%edx
    170e:	be 00 00 00 00       	mov    $0x0,%esi
    1713:	8b 7c 24 0c          	mov    0xc(%rsp),%edi
    1717:	e8 7a ff ff ff       	call   1696 <func4>
    171c:	83 f8 02             	cmp    $0x2,%eax
    171f:	75 07                	jne    1728 <phase_4+0x55>
    1721:	83 7c 24 08 02       	cmpl   $0x2,0x8(%rsp)
    1726:	74 05                	je     172d <phase_4+0x5a>
    1728:	e8 94 05 00 00       	call   1cc1 <explode_bomb>
    172d:	48 83 c4 18          	add    $0x18,%rsp
    1731:	c3                   	ret

0000000000001696 <func4>:
    1696:	48 83 ec 08          	sub    $0x8,%rsp
    169a:	89 d1                	mov    %edx,%ecx
    169c:	29 f1                	sub    %esi,%ecx
    169e:	89 c8                	mov    %ecx,%eax
    16a0:	c1 e8 1f             	shr    $0x1f,%eax
    16a3:	01 c8                	add    %ecx,%eax
    16a5:	d1 f8                	sar    $1,%eax
    16a7:	01 f0                	add    %esi,%eax
    16a9:	39 f8                	cmp    %edi,%eax
    16ab:	7f 0c                	jg     16b9 <func4+0x23>
    16ad:	7c 16                	jl     16c5 <func4+0x2f>
    16af:	b8 00 00 00 00       	mov    $0x0,%eax
    16b4:	48 83 c4 08          	add    $0x8,%rsp
    16b8:	c3                   	ret
    16b9:	8d 50 ff             	lea    -0x1(%rax),%edx
    16bc:	e8 d5 ff ff ff       	call   1696 <func4>
    16c1:	01 c0                	add    %eax,%eax
    16c3:	eb ef                	jmp    16b4 <func4+0x1e>
    16c5:	8d 70 01             	lea    0x1(%rax),%esi
    16c8:	e8 c9 ff ff ff       	call   1696 <func4>
    16cd:	8d 44 00 01          	lea    0x1(%rax,%rax,1),%eax
    16d1:	eb e1                	jmp    16b4 <func4+0x1e>
```

依照前述两个Phase的思路分析，本题的输入也是两个 `int` 变量，我们不妨记作 `a` 和 `b`. 与上一phase相同地，这里 `b` 存放在地址更低处。

`0x16fb` 处的 `test` 语句 `0xc(%rsp)` 要求处存放的变量 `a` 非负。随后 `cmp` 要求 `a<=14`. 接下来进入调用 `func4` 前的传参。参数按顺序依次被设置为 `a`, `0`, `14`. 

再来看 `func4`，为方便起见我们把三个参数依次记为 `x`, `y`, `z`. 进入函数后首先对齐栈指针，然后把 `z-y` 移入 `%rax`，再将`(z-y)>>31` 加到 `%rax`。注意这里的 `>>` 实际上是逻辑右移，也就是说，对于为负的 `z-y` 是 `1`，否则为 `0`. 然后进行算术右移 `>>1`.

回忆第2章中关于补码算术移位的知识，为了使 `x>>k` 的语义与C中 $x/2^k$ 的意义相同，实现方式是当 `x<0` 时计算 $(x+2^{k}-1)/2^{k}$，这样才能获得 $\lceil x/2^k \rceil$ 而不是向下舍入.

综上到 `0x16a5` 为止实际上计算了 `(z-y)/2` 的值。随后比较：`y+(z-y)/2` 和 `x`，如果相等则返回0；如果大于则跳到 `0x16b9`，把 `z` 设置为 `y+(z-y)/2+1`，`x`、`y` 不变，递归调用 `func4`, 记这次调用的返回值为 `k`，则最终返回 `2k`；如果小于则跳到 `0x16c5`，把 `y` 设置为 `y+(z-y)/2+1`，其他两者不变，递归调用 `func4`。记这次调用的返回值为 `k`，则最终返回 `2k+1`.

以上内容是 `func4` 函数的直观翻译，通过这个翻译，我们大概可以感觉到这个函数与二分查找有一点相通之处。这可能会更有助于我们的理解。

下面是函数对应的代码实现：

```c
// aim是phase_4的参数x
int func4(int aim, int lower, int upper){
	int lower=0,upper=14;
	int mid=(upper-lower)/2+lower;
	if(mid>aim){
		return 2*func4(aim, mid, upper);
	}else if(mid<aim){
		return 2*func4(aim, lower, mid)+1;
	}else return 0;
}
```

读懂 `func4` 后解题就变得很简单了，我们回到 `phase_4`，下一个需要执行的语句是 `0x171c` 处的 `cmp`，这里要求 `func4` 返回值必须为2，否则爆炸。根据 `func4` 计算返回值的规则，我们可以看出 `func4` 的调用链应当是：进入mid>aim分支 $\to$ 进入mid<aim分支 $\to$ 终止调用或继续进入mid>aim分支，次数不限。

另一个有用的信息是 `0x1721` 处的 `cmpl`，这里硬性要求 `b==2`，否则爆炸。

综上所述我们可以得出本题的合法输入有且仅有两个：`a=5, b=2` 或 `a=6, b=2`.

# Phase_5

相关代码如下

```asm
0000000000001732 <phase_5>:
    1732:	53                   	push   %rbx
    1733:	48 83 ec 10          	sub    $0x10,%rsp
    1737:	48 89 fb             	mov    %rdi,%rbx
    173a:	e8 0f 03 00 00       	call   1a4e <string_length>
    173f:	83 f8 06             	cmp    $0x6,%eax
    1742:	75 07                	jne    174b <phase_5+0x19>
    1744:	b8 00 00 00 00       	mov    $0x0,%eax
    1749:	eb 23                	jmp    176e <phase_5+0x3c>
    174b:	e8 71 05 00 00       	call   1cc1 <explode_bomb>
    1750:	eb f2                	jmp    1744 <phase_5+0x12>
    1752:	48 63 c8             	movslq %eax,%rcx
    1755:	0f b6 14 0b          	movzbl (%rbx,%rcx,1),%edx
    1759:	83 e2 0f             	and    $0xf,%edx
    175c:	48 8d 35 3d 1c 00 00 	lea    0x1c3d(%rip),%rsi        # 33a0 <array.0>
    1763:	0f b6 14 16          	movzbl (%rsi,%rdx,1),%edx
    1767:	88 54 0c 09          	mov    %dl,0x9(%rsp,%rcx,1)
    176b:	83 c0 01             	add    $0x1,%eax
    176e:	83 f8 05             	cmp    $0x5,%eax
    1771:	7e df                	jle    1752 <phase_5+0x20>
    1773:	c6 44 24 0f 00       	movb   $0x0,0xf(%rsp)
    1778:	48 8d 7c 24 09       	lea    0x9(%rsp),%rdi
    177d:	48 8d 35 2c 1a 00 00 	lea    0x1a2c(%rip),%rsi        # 31b0 <_IO_stdin_used+0x1b0>
    1784:	e8 d9 02 00 00       	call   1a62 <strings_not_equal>
    1789:	85 c0                	test   %eax,%eax
    178b:	75 06                	jne    1793 <phase_5+0x61>
    178d:	48 83 c4 10          	add    $0x10,%rsp
    1791:	5b                   	pop    %rbx
    1792:	c3                   	ret
    1793:	e8 29 05 00 00       	call   1cc1 <explode_bomb>
    1798:	eb f3                	jmp    178d <phase_5+0x5b>

0000000000001a4e <string_length>:
    1a4e:	b8 00 00 00 00       	mov    $0x0,%eax
    1a53:	eb 07                	jmp    1a5c <string_length+0xe>
    1a55:	48 83 c7 01          	add    $0x1,%rdi
    1a59:	83 c0 01             	add    $0x1,%eax
    1a5c:	80 3f 00             	cmpb   $0x0,(%rdi)
    1a5f:	75 f4                	jne    1a55 <string_length+0x7>
    1a61:	c3                   	ret
```

这里笔者把 `string_length` 这个命名语义十分直接清晰的函数也一并附上了，这是由于对命题人的不信任（）

首先为保险起见我们检查一下 `phase_5` 中调用的过程 `string_length`，这个函数确实等价于 `strlen()`. 从 `phase_5` 初始位置开始分析，该函数的唯一参数是输入的字符串，为方便起见，下文我们记为 `str`. 从 `0x173f` 处的 `cmp` 可以看出，字符串的长度必须为6. 然后程序将 `%rax` 清零并跳转至 `0x176e` 继续执行。

观察 `0x176e` 处的代码，这里的两行 `add` 和 `cmp` 加上 `%rax` 初始值为0这三个条件共同作用使我们根据经验判断这里很可能又是一个循环，我们不妨把循环变量记为 `i`。可以看出循环的基本形式大致类似 `while(idx<=5){do_something;}`。程序从 `0x1752` 处开始执行循环体，粗略观察循环体涉及的几行代码，大量的 `Scale=1` 的间接寻址公式再加上 `0x1737` 处将输入参数也即字符串首地址移入 `%rbx` 且频繁出现在间接寻址的 `Rb`位上，这让我们推得应该是对输入字符串进行了某种操作。

循环体内的前三句是提取 `str[i]%16` 的值 `a`，后四句首先把某个字符串的首地址加载进 `%rsi` 内，我们记这个字符串为 `str2`，并且由于下文使用了 `%rsp+9` 为首地址的内存空间，我们记这个字符串为 `str3`. 然后 `str3[i]=str2[a]`.

循环结束后，函数执行到 `0x1773` 处，这里是将 `str3` 结尾的 `\0` 补充上。然后程序会将 `str3` 作为一个参数，另一个参数是指针 `0x31b0`，指向一个用于判断结果的字符串 `str4`，二者需要完全一致方可结束该phase.

至此结合 `phase_1` 中我们使用gdb查看目标字符串的方式，我们可以找出解决本phase的方法：

首先，随便输入6个字符用于尝试，其次在 `0x175c` 处设置断点以字符串形式查看 `%rsi` 的内容获取工具串（我们要使用这个字符串的对应位置字符拼接出目标串），然后在 `0x177d` 处设置断点以字符串形式查看 `%rsi` 的内容获取目标串。

最后我们根据已经掌握的信息，结合命令 `man ascii`（获取ASCII码表，因为我们需要每个字符的ASCII码的十六进制个位信息），我们合理组合输入串的字符对应的十六进制个位，使之作为索引可以正确提取工具串中的字符即可。

# Phase_6

代码如下

```asm
000000000000179a <phase_6>:
    179a:	41 54                	push   %r12
    179c:	55                   	push   %rbp
    179d:	53                   	push   %rbx
    179e:	48 83 ec 50          	sub    $0x50,%rsp
    17a2:	48 8d 74 24 30       	lea    0x30(%rsp),%rsi
    17a7:	e8 80 05 00 00       	call   1d2c <read_six_numbers>
    17ac:	bd 00 00 00 00       	mov    $0x0,%ebp
    17b1:	eb 29                	jmp    17dc <phase_6+0x42>
    17b3:	e8 09 05 00 00       	call   1cc1 <explode_bomb>
    17b8:	eb 36                	jmp    17f0 <phase_6+0x56>
    17ba:	83 c3 01             	add    $0x1,%ebx
    17bd:	83 fb 05             	cmp    $0x5,%ebx
    17c0:	7f 17                	jg     17d9 <phase_6+0x3f>
    17c2:	48 63 c5             	movslq %ebp,%rax
    17c5:	48 63 d3             	movslq %ebx,%rdx
    17c8:	8b 7c 94 30          	mov    0x30(%rsp,%rdx,4),%edi
    17cc:	39 7c 84 30          	cmp    %edi,0x30(%rsp,%rax,4)
    17d0:	75 e8                	jne    17ba <phase_6+0x20>
    17d2:	e8 ea 04 00 00       	call   1cc1 <explode_bomb>
    17d7:	eb e1                	jmp    17ba <phase_6+0x20>
    17d9:	44 89 e5             	mov    %r12d,%ebp
    17dc:	83 fd 05             	cmp    $0x5,%ebp
    17df:	7f 18                	jg     17f9 <phase_6+0x5f>
    17e1:	48 63 c5             	movslq %ebp,%rax
    17e4:	8b 44 84 30          	mov    0x30(%rsp,%rax,4),%eax
    17e8:	83 e8 01             	sub    $0x1,%eax
    17eb:	83 f8 05             	cmp    $0x5,%eax
    17ee:	77 c3                	ja     17b3 <phase_6+0x19>
    17f0:	44 8d 65 01          	lea    0x1(%rbp),%r12d
    17f4:	44 89 e3             	mov    %r12d,%ebx
    17f7:	eb c4                	jmp    17bd <phase_6+0x23>
    17f9:	b8 00 00 00 00       	mov    $0x0,%eax
    17fe:	eb 13                	jmp    1813 <phase_6+0x79>
    1800:	48 63 c8             	movslq %eax,%rcx
    1803:	ba 07 00 00 00       	mov    $0x7,%edx
    1808:	2b 54 8c 30          	sub    0x30(%rsp,%rcx,4),%edx
    180c:	89 54 8c 30          	mov    %edx,0x30(%rsp,%rcx,4)
    1810:	83 c0 01             	add    $0x1,%eax
    1813:	83 f8 05             	cmp    $0x5,%eax
    1816:	7e e8                	jle    1800 <phase_6+0x66>
    1818:	be 00 00 00 00       	mov    $0x0,%esi
    181d:	eb 17                	jmp    1836 <phase_6+0x9c>
    181f:	48 8b 52 08          	mov    0x8(%rdx),%rdx
    1823:	83 c0 01             	add    $0x1,%eax
    1826:	48 63 ce             	movslq %esi,%rcx
    1829:	39 44 8c 30          	cmp    %eax,0x30(%rsp,%rcx,4)
    182d:	7f f0                	jg     181f <phase_6+0x85>
    182f:	48 89 14 cc          	mov    %rdx,(%rsp,%rcx,8)
    1833:	83 c6 01             	add    $0x1,%esi
    1836:	83 fe 05             	cmp    $0x5,%esi
    1839:	7f 0e                	jg     1849 <phase_6+0xaf>
    183b:	b8 01 00 00 00       	mov    $0x1,%eax
    1840:	48 8d 15 09 49 00 00 	lea    0x4909(%rip),%rdx        # 6150 <node1>
    1847:	eb dd                	jmp    1826 <phase_6+0x8c>
    1849:	48 8b 1c 24          	mov    (%rsp),%rbx
    184d:	48 89 d9             	mov    %rbx,%rcx
    1850:	b8 01 00 00 00       	mov    $0x1,%eax
    1855:	eb 11                	jmp    1868 <phase_6+0xce>
    1857:	48 63 d0             	movslq %eax,%rdx
    185a:	48 8b 14 d4          	mov    (%rsp,%rdx,8),%rdx
    185e:	48 89 51 08          	mov    %rdx,0x8(%rcx)
    1862:	83 c0 01             	add    $0x1,%eax
    1865:	48 89 d1             	mov    %rdx,%rcx
    1868:	83 f8 05             	cmp    $0x5,%eax
    186b:	7e ea                	jle    1857 <phase_6+0xbd>
    186d:	48 c7 41 08 00 00 00 	movq   $0x0,0x8(%rcx)
    1874:	00 
    1875:	bd 00 00 00 00       	mov    $0x0,%ebp
    187a:	eb 07                	jmp    1883 <phase_6+0xe9>
    187c:	48 8b 5b 08          	mov    0x8(%rbx),%rbx
    1880:	83 c5 01             	add    $0x1,%ebp
    1883:	83 fd 04             	cmp    $0x4,%ebp
    1886:	7f 11                	jg     1899 <phase_6+0xff>
    1888:	48 8b 43 08          	mov    0x8(%rbx),%rax
    188c:	8b 00                	mov    (%rax),%eax
    188e:	39 03                	cmp    %eax,(%rbx)
    1890:	7e ea                	jle    187c <phase_6+0xe2>
    1892:	e8 2a 04 00 00       	call   1cc1 <explode_bomb>
    1897:	eb e3                	jmp    187c <phase_6+0xe2>
    1899:	48 83 c4 50          	add    $0x50,%rsp
    189d:	5b                   	pop    %rbx
    189e:	5d                   	pop    %rbp
    189f:	41 5c                	pop    %r12
    18a1:	c3                   	ret
```

毫无疑问前六个phase中最困难的一个，仅从代码量上就可以看出。（共计84行汇编代码）

进入 `phase_6` 后除了将callee-saved寄存器压栈外，本过程将栈指针向下减了 `0x50` 也就是开辟了80字节的栈空间。为了弄清楚这长达80字节的栈空间，我们在这里插入一张示意图。

首先读入六个整数，然后 `%ebp` 成为了第一个循环变量，这里我们记为 `i`。首个循环体从 `0x17e1` 开始，循环范围是 `[0,5]`. 会先把 `num[i]-1` 逐个与5比较，如果把 `num[i]-1` 看作无符号整数后>5则爆炸。也就是说，我们输入的6个数必须全部位于1-6之间。

从 `0x17f0` 开始，程序进入内层循环。首先把 `i+1` 赋给 `%ebx`，这也就是内层变量，我们记为 `j`. 跳转到 `0x17bd` 后不难发现内层循环的范围是 `[(i+1),5]`. 然后执行到 `0x17cc` 的 `cmp` 时我们可以确定语义是比较 `num[i]` 与 `num[j]`，如果相等则爆炸。

这个两层循环等价于如下代码：

```c
for(int i=0;i<6;i++){
	if(num[i]-1>5) explode_bomb();
	for(int j=i+1;j<6;j++){
		if(num[i]==num[j]) explode_bomb();
	}
}
```

这之后，程序跳转到 `0x17f9`，然后进入新的循环。该循环变量为 `%eax`，范围仍为 `[0，5]`，记循环变量为 `i`. 循环体从 `0x1800` 至 `0x180c`，大意为 `num[i]=7-num[i]`.

结束后又是一个循环，范围仍为 `[0,5]`，记变量为 `i`. 循环大意为加载一个数据结构的首地址到 `%rdx` 并把另一个计数变量 `%eax` 设置为1. 随后跳到 `0x1826` 并比较 `%eax` 与 `num[i]`. 如果 `num[i]>%eax`，则将 `M(%rdx+8)` 加载到 `%rdx` 中。

虽然可能有些牵强，但学过数算第二章后对于 `movq 8(%rdx),%rdx` 这样的结构我们有可能会有些敏感——这看起来非常像是链表。

既然上文所说的 `%rdx` 为首地址的数据结构是链表，那么 `%eax` 的作用也就很明显了，即找出链表内第 `num[i]` 个节点。

需要注意 `0x182f` 这条指令的含义，当 `num[i]<=%eax` 时，这条指令不断把当前所在节点的地址放在 `(%rsp+8i)` 中。到这里，我们便可以看懂为什么要申请80字节的空间，但存放输入的6个整数会从 `%rsp+48` 开始存放——因为这6个指向节点的地址需要占用底部的48字节。

下一个循环从 `0x1849` 开始，这次循环变量为 `%eax`，我们仍然记为 `i`，范围还是 `[0-5]`. 不难从 `movq $0,0x8(%rcx)` 入手读出这个循环实际上是从栈上低处的节点地址到高处的节点地址顺序构建新的链表。

最后一个循环从 `0x1875` 初始化，有了上面的经验，很容易发现其实只是比较相邻两个节点是否构成递增关系。

综上所述，解题方法应该是：在 `0x1840` 处设置断点，使用gdb查看 `%rdx` 后6个8字节内容，并查看这些地址内数据，根据这些数值的大小关系构建代表他们序号的字符串。

# Secret Phase

待笔者心情大好时再行更新。由于不涉及评分，笔者在完成Lab时直接跳过了这一部分。