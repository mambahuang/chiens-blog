---
title: "Transformer 與 Attention 機制：用視覺化方式看懂 token、QKV 與上下文"
date: "2026-07-20"
tags: ["AI", "Deep Learning"]
category: "AI"
excerpt: "從 tokenization、embedding、Q/K/V 到 multi-head attention，透過互動圖一步步看懂 Transformer 為什麼能靠上下文更新詞義，並在 GPU 上大規模訓練。"
---

## 前言

目前主流的大型語言模型，像是 GPT-4、Claude 3、Llama 3，以及 Gemini 是怎麼看待你對他說的話？他又是用什麼邏輯來回覆你所說的話？今天就來介紹其中的底層邏輯 —— **Transformer 和 Attention 機制**。

以下先舉一個簡單的例子：

你可以把整個模型先想成一台機器：

- 輸入前文 tokens
- 在向量空間裡做大量矩陣運算
- 輸出 tokens 的機率分佈，選擇下一個 token

大型語言模型最核心的任務就是：**藉由前面的 tokens，預測下一個 token。**

<div class="side-note">
	註：不一定是選擇機率最高的 token，這要看模型的選擇策略，因為不是本文的主題，這裡就先不多加贅述。
</div>

<div class="io-training-flow"></div>

下面用視覺化方式，從七個步驟把它拆開：

1. 文字怎麼被切成 token
2. token 怎麼變成向量
3. attention 怎麼決定誰該看誰，又怎麼把資訊寫回去
4. 為什麼同一個詞會因上下文而改變意思
5. multi-head 怎麼讓多種關係同時被看見
6. 一個 block 裡除了 attention 還有什麼，以及為什麼要疊很多層
7. 為什麼 Transformer 特別適合 GPU，大到足以訓練出今天的 LLM

<div class="info-box">
	<div class="info-box-title">先抓住一句總結</div>
	<div class="info-box-content">
		<strong>Transformer 的本質</strong>，就是把一句話拆成 token，替每個 token 建立向量表示，再透過 attention 讓這些 token 彼此交換資訊，反覆更新每個位置的向量，最後拿更新後的表示去預測下一個 token。
	</div>
</div>

## 1. 模型看到的不是文字，是 token id

人類看的是文字；模型看到的是一串編號。

在真正進入神經網路之前，文字會先被 tokenizer 切成 token。這個 token 不一定是一個完整單字，也可能是一個子字串、標點、甚至連前面的空格一起算進去。

<div class="token-strip"></div>

上圖用 `Tokenization isn't word-splitting.` 這句話示範了三種常見情況：`Tokenization` 這個較少見的字被拆成 `Token` + `ization`，`isn't` 也被拆成兩段；句號自成一個 token；而空格則被併進後面那個 token 裡（例如 `␣word`）。

這也解釋了為什麼模型的計價單位是 token 而不是字數 —— 常見的英文單字大約 1 個 token，罕見字、程式碼、中文則往往需要更多。

這一步非常重要，因為後面所有運算都不是直接對文字做，而是對 token id 對應到的向量做。

## 2. Embedding lookup：把 token 變成向量

token id 還只是索引，本身沒有數學意義。真正讓模型可以運算的是 **embedding lookup**。

每個 token 會查一張很大的 embedding table，拿到一個 high-dimensional vector。如下圖：

<div class="embedding-lookup"></div>

接下來所有 Q/K/V 與 attention 計算，都是透過這些 embeddings 進行矩陣乘法的運算。

圖上會有 position 的概念是因為 **attention 本身沒有順序概念**。等一下會看到，Q 和 K 的 dot product 只比較兩個向量的內容，完全不管誰前誰後。如果只餵 embedding 進去，`貓咬狗` 和 `狗咬貓` 對模型來說會是一模一樣的輸入，所以送進 attention 的資料，除了 embedding 之外還要有 position 的資訊，這就是 **positional encoding**。

所以到這一步為止，可以先記一件事：token id 用來查出對應的 embedding 向量；模型真正操作的對象就是這些向量，以及向量之間的關係。

## 3. Attention：token 之間怎麼交換資訊

接下來才是 Transformer 最關鍵的地方。

一個 token 並不只帶著自己原本的 embedding 往前走，它還會根據上下文，從其他 token 那裡拉資訊回來。這個資訊交換流程，就是 **attention**。

### 先看完整的公式

整個 attention 其實可以用一行寫完：

<div class="attention-formula"></div>

Q、K、V 分別代表：

- **Query (Q)**：某個 token 現在想找什麼資訊
- **Key (K)**：某個 token 身上有哪些資訊可供匹配
- **Value (V)**：如果真的要把資訊傳出去，實際傳的是什麼內容

Q、K、V 是怎麼來的：

- <strong>Q = W<sub>Q</sub> × E</strong>
- <strong>K = W<sub>K</sub> × E</strong>
- <strong>V = W<sub>V</sub> × E</strong>

以 `a fluffy blue creature roamed the verdant forest` 這句話為例，看 `creature` 這個位置：

<div class="qkv-projection"></div>

### Q·Kᵀ：決定誰該看誰

有了 Q 和 K 之後，把每個 Query 和所有 Key 做 dot product，就得到公式裡的 `Q·Kᵀ`，也就是 attention score。下圖顯示的是再經過 softmax 之後的數值，也就是 attention weight（每一欄總和為 1）：

<div class="attention-matrix"></div>

看框起來的 `creature` 那一欄：注意力幾乎全部落在 `fluffy`（0.42）和 `blue`（0.58）上，其他位置都是 0 —— 模型學到「名詞該去找修飾它的形容詞」。

圖的下半部把這一欄的權重乘上各自的 V，加總後就得到這個位置的更新量 `Δ`。

另外，因為是做 next-token prediction，模型不能偷看未來；在這種「欄是 Query、列是 Key」的畫法下，被 mask 的區域會落在**左下角**。

### 從權重到 Δ，再加回去

算出 `Δ` 之後還有最後一步 —— **加回去**原本的向量：

<div class="qkv-flow"></div>

**Δ 只是更新量，不是最終向量**。如果 attention 直接用 Δ 取代掉原本的 embedding，token 原本的詞義就整個被沖掉了；改成相加（residual connection），原意會被保留，這也是為什麼疊了幾十層之後資訊不會在中途消失。

## 4. 同一個詞，會被上下文重新定義

attention 真正厲害的地方，不是在「找到相關詞」而已，而是在**找到之後，真的把上下文資訊寫回目前這個 token 的表示裡**。

經典例子就是 `mole`。同一個 token，放進不同句子會被拉向完全不同的意思：

- American shrew mole
- One mole of carbon dioxide
- Take a biopsy of the mole

單看 `mole` 你無法判斷語意；是周圍 token 決定它最後要往哪個語境收斂。

<div class="context-shift"></div>

這就是 attention 的核心價值：**一個 token 的意思不是固定不變，而是會被上下文動態更新。**

所以比較精確的說法不是「模型先知道每個字的意思，再去看句子」；而是「模型讓句子裡的每個位置互相作用，最後把比較正確的詞義算出來」。

## 5. Multi-head attention：同時看見多種關係

如果 attention 只做一次，模型一次只能學到一種關係，這太弱了。

所以 Transformer 不是只做一組 Q / K / V，而是同時做很多組，也就是 **multi-head attention**。

每個 head 都有自己獨立的 Query、Key、Value 矩陣，因此不同 head 可以專門處理不同型態的關係，例如：

- 一個 head 看代名詞對應到誰
- 一個 head 看形容詞修飾哪個名詞
- 一個 head 看動詞和受詞的關係
- 一個 head 看長距離依存或語氣訊號

最後，這些 head 各自提出的更新會被合併，讓單一 token 同時吸收多種上下文線索。所以 multi-head attention 不是「重複做很多次一樣的事」，而是讓模型可以**平行地看很多種不同的關係模式**。

## 6. Attention 之後還有 MLP，而且整個 block 會反覆堆疊

一個 Transformer block 通常不只有 attention，後面還會接一個 position-wise MLP（也常被叫做 feed-forward network）。

可以粗略把它理解成：

- **attention**：向外看，從其他 token 蒐集上下文
- **MLP (Multilayer Perceptron)**：向內算，把這個位置目前累積到的資訊做更深的非線性變換

這種 block 會一層接一層堆疊。每過一層，每個 token 的表示都會變得更 contextual、更抽象，也更接近最後能拿來做預測的狀態。

## 7. 為什麼 Transformer 能擴到這麼大：平行化

Transformer 的成功，不只因為 attention 聰明，也因為它的運算形式非常適合現代硬體。

早期的 RNN (Recurrent Neural Network) 有一個根本限制：第 2 個位置要等第 1 個位置算完，第 3 個位置要等第 2 個位置算完。它的時間步驟是**循序相依**的。

Transformer 則不同。對同一層來說，整段序列的 Query、Key、Value 可以一次算出來，attention 權重也可以用大矩陣乘法一起完成。

<div class="parallel-compare"></div>

這件事非常關鍵，因為 GPU 最擅長的就是：

- 大量相同形狀的矩陣運算
- 同時處理很多位置
- 用平行硬體把吞吐量拉到極大

所以 Transformer 並不是剛好可以在 GPU 上跑，而是它的結構幾乎就是為這類硬體量身打造的。

不過這件事是有代價的：RNN 的順序資訊來自它真的照順序算，而 Transformer 放棄了循序運算，順序就得靠第 2 節的 positional encoding 額外補回來。可以平行，和需要位置編碼，其實是同一個設計選擇的一體兩面。

## 把整件事串成一句話

如果把整個流程濃縮成一段：

1. 句子先被切成 token
2. token 轉成 embedding，再加上 positional encoding
3. 每個 token 產生自己的 Query、Key、Value
4. 透過 Query-Key 的 dot product 得到 attention score
5. 用 softmax 把 attention score 轉成權重
6. 用權重聚合 Value，更新每個位置的表示
7. 經過多個 head、多層 block，反覆細化語意
8. 最後用更新後的表示去預測下一個 token

其實從頭到尾看起來都只是矩陣乘法、加權平均與非線性變換，只要資料夠多、模型夠大、訓練夠久，這些結構化運算就會長出我們今天看到的語言能力。

如果你以前對 Transformer 感到很抽象，希望看完這篇文章之後，它至少變成一個你能在腦中具象化的流程：token 變向量，向量彼此對話，對話結果再回來更新自己，最後產生下一個 token。

## 參考資料

**原始論文**

- [Attention Is All You Need](https://arxiv.org/abs/1706.03762) — Vaswani et al., 2017。

**影片**

- [Visualizing transformers and attention | Talk for TNG Big Tech Day '24](https://youtu.be/KJtZARuO3JY?si=YqhnAITslIX9isjY) — 本文多數圖解的靈感來源。
- [Attention in transformers, step-by-step | Deep Learning Chapter 6](https://www.youtube.com/watch?v=eMlx5fFNoYc) — 3Blue1Brown，專講 attention 與 Q/K/V。

**延伸閱讀**

- [The Illustrated Transformer](https://jalammar.github.io/illustrated-transformer/) — Jay Alammar，經典的圖解教學。
- [Tiktokenizer](https://tiktokenizer.vercel.app/) — 互動工具，可以實際看到自己的文字被切成哪些 token。
