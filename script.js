// 定义全局变量
let riddle = [];
let guesses = 0;
let digits = 4; // 默认数字位数
const symbols = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, 32); // Base32字符集
document.getElementById("guessInput").addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        submitGuess(); // 按下 Enter 键时提交猜测
        event.preventDefault(); // 阻止默认行为（如表单提交）
    }
});
// 动态生成下拉菜单选项
function populateDigitSelect() {
    const digitSelect = document.getElementById("digitSelect");
    digitSelect.innerHTML = ""; // 清空现有选项

    for (let i = 1; i <= 32; i++) {
        const option = document.createElement("option");
        option.value = i; // 设置选项值
        option.textContent = i; // 设置选项文本
        if (i === 4) {
            option.selected = true; // 默认选中 4
        }
        digitSelect.appendChild(option); // 添加选项到下拉菜单
    }
}

// 更新用户选择的数字位数
function updateDigits() {
    const digitSelect = document.getElementById("digitSelect");
    digits = parseInt(digitSelect.value, 10); // 获取选择的数字位数
    document.getElementById("digitLength").innerText = digits; // 更新显示数字长度
    startNewGame(); // 用户修改位数后重新开始游戏
}

// 初始化新游戏
function startNewGame() {
    riddle = generateRiddle(); // 生成新的谜底
    guesses = 0; // 重置猜测次数

    document.getElementById("digitLength").innerText = digits; // 更新数字长度提示
    document.getElementById("log").innerHTML = ""; // 清空日志区域
    document.getElementById("guessInput").value = ""; // 清空输入框
    document.getElementById("winMessage").style.display = "none"; // 隐藏胜利信息

    console.log("Riddle:", riddle); // Debug: 显示谜底
    alert(`A new game has started! Guess the ${digits}-character number.`);
}

// 生成谜底
function generateRiddle() {
    const riddleSet = new Set();
    while (riddleSet.size < digits) {
        const randomChar = symbols[Math.floor(Math.random() * 32)];
        riddleSet.add(randomChar);
    }
    return Array.from(riddleSet);
}

// 提交猜测
function submitGuess() {
    const input = document.getElementById("guessInput");
    const guess = input.value.toUpperCase().trim();

    if (!validateGuess(guess)) {
        input.value = ""; // 清空输入框
        return;
    }

    const [a, b] = calculateAB(guess);
    guesses++;

    const logDiv = document.getElementById("log");
    const resultMessage = `${guess}: ${a}A${b}B (Guess #${guesses})`;
    logDiv.innerHTML += `<p>${resultMessage}</p>`;

    input.value = ""; // 清空输入框

    if (a === digits) {
        displayWinMessage();
        return;
    }
}

// 校验用户输入
function validateGuess(guess) {
    if (guess.length !== digits) {
        alert(`Input must be exactly ${digits} characters long.`);
        return false;
    }

    if (!/^[0-9A-V]+$/.test(guess)) {
        alert("Invalid characters! Use only 0-9 and A-V.");
        return false;
    }

    if (new Set(guess).size !== guess.length) {
        alert("Characters cannot be repeated.");
        return false;
    }

    return true;
}

// 计算 A 和 B
function calculateAB(guess) {
    let a = 0, b = 0;
    for (let i = 0; i < digits; i++) {
        if (guess[i] === riddle[i]) {
            a++;
        } else if (riddle.includes(guess[i])) {
            b++;
        }
    }
    return [a, b];
}

// 显示胜利信息
function displayWinMessage() {
    const winMessageDiv = document.getElementById("winMessage");
    winMessageDiv.innerText = `Congratulations! You guessed it in ${guesses} tries!`;
    winMessageDiv.style.display = "block";
}

// 页面加载时初始化下拉菜单和游戏
window.onload = function () {
    populateDigitSelect(); // 动态生成 1~32 的选项
    startNewGame(); // 初始化游戏
};
