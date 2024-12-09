import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Howl } from 'howler';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Volume2, VolumeX } from 'lucide-react';

// Game components
const PlinkoGame = ({ balance, setBalance, betAmount, onWin, soundEnabled, difficulty }) => {
  const winSound = new Howl({ src: ['win.mp3'] }    </motion.div>
);
  const loseSound = new Howl({ src: ['lose.mp3'] }    </motion.div>
);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 0 }    </motion.div>
);
  const [isPlaying, setIsPlaying] = useState(false    </motion.div>
);
  const canvasRef = useRef(null    </motion.div>
);
  const ROWS = 8;
  const COLS = 15;
  const MULTIPLIERS = [0.2, 0.3, 0.5, 1.5, 2, 1.5, 0.5, 0.3, 0.2];

  useEffect(() => {
    drawBoard(    </motion.div>
);
  }, [ballPosition]    </motion.div>
);

  const drawBoard = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d'    </motion.div>
);
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height    </motion.div>
);

    // Draw pins
    ctx.fillStyle = '#4A5568';
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col <= row; col++) {
        const x = width / 2 + (col - row / 2) * 40;
        const y = 50 + row * 40;
        ctx.beginPath(    </motion.div>
);
        ctx.arc(x, y, 4, 0, Math.PI * 2    </motion.div>
);
        ctx.fill(    </motion.div>
);
      }
    }

    // Draw ball
    if (isPlaying) {
      ctx.fillStyle = '#FC8181';
      ctx.beginPath(    </motion.div>
);
      ctx.arc(ballPosition.x, ballPosition.y, 6, 0, Math.PI * 2    </motion.div>
);
      ctx.fill(    </motion.div>
);
    }

    // Draw multiplier slots
    ctx.fillStyle = '#2D3748';
    MULTIPLIERS.forEach((mult, i) => {
      const x = width / 2 + (i - MULTIPLIERS.length / 2 + 0.5) * 40;
      const y = height - 30;
      ctx.fillRect(x - 20, y, 40, 20    </motion.div>
);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${mult}x`, x, y + 15    </motion.div>
);
      ctx.fillStyle = '#2D3748';
    }    </motion.div>
);
  };

  const dropBall = () => {
    if (isPlaying || balance < betAmount) return;
    setIsPlaying(true    </motion.div>
);
    setBalance(prev => prev - betAmount    </motion.div>
);

    const canvas = canvasRef.current;
    let x = canvas.width / 2;
    let y = 0;
    let vx = 0;
    let vy = 0;

    const animate = () => {
      if (y >= canvas.height - 50) {
        finishDrop(x    </motion.div>
);
        return;
      }

      vy += 0.5;
      vx *= 0.99;
      x += vx;
      y += vy;

      // Bounce off pins
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col <= row; col++) {
          const pinX = canvas.width / 2 + (col - row / 2) * 40;
          const pinY = 50 + row * 40;
          const dx = x - pinX;
          const dy = y - pinY;
          const distance = Math.sqrt(dx * dx + dy * dy    </motion.div>
);
          
          if (distance < 10) {
            const angle = Math.atan2(dy, dx    </motion.div>
);
            vx = Math.cos(angle) * 3 + (Math.random() - 0.5) * 2;
            vy = Math.abs(vy) * 0.7;
          }
        }
      }

      setBallPosition({ x, y }    </motion.div>
);
      requestAnimationFrame(animate    </motion.div>
);
    };

    animate(    </motion.div>
);
  };

  const finishDrop = (finalX) => {
    setIsPlaying(false    </motion.div>
);
    const slot = Math.floor((finalX - (canvasRef.current.width / 2 - MULTIPLIERS.length * 20)) / 40    </motion.div>
);
    const winMultiplier = MULTIPLIERS[slot] || 0;
    const winAmount = betAmount * winMultiplier;
    setBalance(prev => prev + winAmount    </motion.div>
);
    onWin(betAmount, winAmount    </motion.div>
);
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
    <div>
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full bg-gray-900 rounded-lg mb-4"
      />
      <Button 
        onClick={dropBall}
        disabled={isPlaying || balance < betAmount}
        className="w-full"
      >
        Drop Ball (${betAmount})
      </Button>
    </div>
      </motion.div>
);
};

const SlotMachine = ({ balance, setBalance, betAmount, onWin, type = "classic" }) => {
  const [reels, setReels] = useState([0, 0, 0]    </motion.div>
);
  const [spinning, setSpinning] = useState(false    </motion.div>
);
  
  const SYMBOLS = type === "classic" ? {
    HOT: { symbol: "🔥", value: 5 },
    SEVEN: { symbol: "7️⃣", value: 4 },
    BAR: { symbol: "📊", value: 3 },
    CHERRY: { symbol: "🍒", value: 2 },
    LEMON: { symbol: "🍋", value: 1 }
  } : {
    DRAGON_RED: { symbol: "🐲", value: 5 },
    DRAGON_GOLD: { symbol: "🐉", value: 4 },
    DRAGON_GREEN: { symbol: "🐲", value: 3 },
    COIN: { symbol: "🪙", value: 2 },
    PEARL: { symbol: "🔮", value: 1 }
  };

  const symbolKeys = Object.keys(SYMBOLS    </motion.div>
);

  const spin = () => {
    if (spinning || balance < betAmount) return;
    
    setSpinning(true    </motion.div>
);
    setBalance(prev => prev - betAmount    </motion.div>
);

    // Animated spin effect
    let spins = 0;
    const maxSpins = 20;
    const interval = setInterval(() => {
      setReels(prev => prev.map(() => Math.floor(Math.random() * symbolKeys.length))    </motion.div>
);
      spins++;
      
      if (spins >= maxSpins) {
        clearInterval(interval    </motion.div>
);
        finishSpin(    </motion.div>
);
      }
    }, 100    </motion.div>
);
  };

  const finishSpin = () => {
    const finalReels = reels.map(() => Math.floor(Math.random() * symbolKeys.length)    </motion.div>
);
    setReels(finalReels    </motion.div>
);
    setSpinning(false    </motion.div>
);

    // Calculate win
    const symbols = finalReels.map(index => symbolKeys[index]    </motion.div>
);
    let winMultiplier = 0;

    if (symbols.every(s => s === symbols[0])) {
      winMultiplier = SYMBOLS[symbols[0]].value;
    } else if (symbols.filter(s => s === symbols[0]).length === 2) {
      winMultiplier = SYMBOLS[symbols[0]].value * 0.5;
    }

    const winAmount = betAmount * winMultiplier;
    setBalance(prev => prev + winAmount    </motion.div>
);
    onWin(betAmount, winAmount    </motion.div>
);
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
    <div className="text-center">
      <div className="flex justify-center gap-4 mb-6">
        <div className="relative">
          <div className="text-6xl bg-gray-800 p-6 rounded-lg">
            {SYMBOLS[symbolKeys[reels[0]]].symbol}
          </div>
        </div>
        <div className="relative">
          <div className="text-6xl bg-gray-800 p-6 rounded-lg">
            {SYMBOLS[symbolKeys[reels[1]]].symbol}
          </div>
        </div>
        <div className="relative">
          <div className="text-6xl bg-gray-800 p-6 rounded-lg">
            {SYMBOLS[symbolKeys[reels[2]]].symbol}
          </div>
        </div>
      </div>
      <Button
        onClick={spin}
        disabled={spinning || balance < betAmount}
        className="w-full"
      >
        Spin (${betAmount})
      </Button>
    </div>
      </motion.div>
);
};

const CasinoGames = () => {
  const [balance, setBalance] = useState(1000    </motion.div>
);
  const [betAmount, setBetAmount] = useState(10    </motion.div>
);
  const [history, setHistory] = useState([]    </motion.div>
);
  const [soundEnabled, setSoundEnabled] = useState(true    </motion.div>
);
  const [difficulty, setDifficulty] = useState('MEDIUM'    </motion.div>
);

  const onWin = (bet, win) => {
    setHistory(prev => [...prev, {
      timestamp: new Date().toISOString(),
      bet,
      win,
      profit: win - bet
    }]    </motion.div>
);
  };

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
    >
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Casino Games</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-6">
            <div className="text-lg font-bold">Balance: ${balance.toFixed(2)}</div>
            <div className="space-x-2">
              <Button onClick={() => setSoundEnabled(!soundEnabled)}>
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </Button>
              <Input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(Math.min(Number(e.target.value), balance))}
                className="w-24 inline-block"
              />
            </div>
          </div>

          <Tabs defaultValue="plinko">
            <TabsList>
              <TabsTrigger value="plinko">Plinko</TabsTrigger>
              <TabsTrigger value="classic-slots">Hot to Burn</TabsTrigger>
              <TabsTrigger value="dragon-slots">Dragons</TabsTrigger>
            </TabsList>

            <TabsContent value="plinko">
              <PlinkoGame
                balance={balance}
                setBalance={setBalance}
                betAmount={betAmount}
                onWin={onWin}
                soundEnabled={soundEnabled}
                difficulty={difficulty}
              />
            </TabsContent>

            <TabsContent value="classic-slots">
              <SlotMachine
                balance={balance}
                setBalance={setBalance}
                betAmount={betAmount}
                onWin={onWin}
                type="classic"
              />
            </TabsContent>

            <TabsContent value="dragon-slots">
              <SlotMachine
                balance={balance}
                setBalance={setBalance}
                betAmount={betAmount}
                onWin={onWin}
                type="dragon"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <h3 className="font-bold mb-2">Recent History</h3>
            <div className="space-y-2">
              {history.slice(-5).reverse().map((entry, i) => (
                <div key={i} className="flex justify-between bg-gray-100 p-2 rounded">
                  <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                  <span>Bet: ${entry.bet}</span>
                  <span className={entry.profit > 0 ? "text-green-600" : "text-red-600"}>
                    {entry.profit > 0 ? "+" : "-"}${Math.abs(entry.profit).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-100 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              Please gamble responsibly. Set limits and never bet more than you can afford to lose.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
      </motion.div>
);
};

export default CasinoGames;
