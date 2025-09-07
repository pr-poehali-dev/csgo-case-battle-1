import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Icon from '@/components/ui/icon'

interface Skin {
  id: string
  name: string
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  price: number
  image: string
  color: string
}

interface CaseType {
  id: string
  name: string
  price: number
  skins: Skin[]
}

const Index = () => {
  const [balance, setBalance] = useState(1000)
  const [inventory, setInventory] = useState<Skin[]>([])
  const [isOpeningCase, setIsOpeningCase] = useState(false)
  const [selectedCase, setSelectedCase] = useState<CaseType | null>(null)
  const [wonSkin, setWonSkin] = useState<Skin | null>(null)
  const [upgradeWheel, setUpgradeWheel] = useState<{ spinning: boolean; result: Skin | null }>({ spinning: false, result: null })
  const [selectedSkin, setSelectedSkin] = useState<Skin | null>(null)
  const [activeTab, setActiveTab] = useState('home')
  const [adminMode, setAdminMode] = useState(false)
  const [adminBalance, setAdminBalance] = useState('')

  const rarityColors = {
    common: '#6B7280',
    uncommon: '#10B981', 
    rare: '#3B82F6',
    epic: '#8B5CF6',
    legendary: '#F59E0B'
  }

  const cases: CaseType[] = [
    {
      id: 'weapon-case',
      name: 'Weapon Case',
      price: 100,
      skins: [
        { id: '1', name: 'AK-47 Redline', rarity: 'epic', price: 300, image: '🔫', color: '#8B5CF6' },
        { id: '2', name: 'AWP Dragon Lore', rarity: 'legendary', price: 2500, image: '🎯', color: '#F59E0B' },
        { id: '3', name: 'M4A4 Asiimov', rarity: 'rare', price: 150, image: '🔫', color: '#3B82F6' },
        { id: '4', name: 'Glock Water Elemental', rarity: 'uncommon', price: 50, image: '🔫', color: '#10B981' },
        { id: '5', name: 'P250 Sand Dune', rarity: 'common', price: 10, image: '🔫', color: '#6B7280' }
      ]
    },
    {
      id: 'knife-case', 
      name: 'Knife Case',
      price: 250,
      skins: [
        { id: '6', name: 'Karambit Fade', rarity: 'legendary', price: 3000, image: '🗡️', color: '#F59E0B' },
        { id: '7', name: 'Butterfly Knife', rarity: 'epic', price: 800, image: '🗡️', color: '#8B5CF6' },
        { id: '8', name: 'Bayonet Tiger Tooth', rarity: 'rare', price: 400, image: '🗡️', color: '#3B82F6' }
      ]
    },
    {
      id: 'glove-case',
      name: 'Glove Case', 
      price: 150,
      skins: [
        { id: '9', name: 'Driver Gloves Crimson', rarity: 'legendary', price: 1500, image: '🧤', color: '#F59E0B' },
        { id: '10', name: 'Sport Gloves Hedge Maze', rarity: 'epic', price: 500, image: '🧤', color: '#8B5CF6' },
        { id: '11', name: 'Hand Wraps Leather', rarity: 'rare', price: 200, image: '🧤', color: '#3B82F6' }
      ]
    }
  ]

  const openCase = async (caseType: CaseType) => {
    if (balance < caseType.price) {
      alert('Недостаточно средств!')
      return
    }

    setBalance(prev => prev - caseType.price)
    setSelectedCase(caseType)
    setIsOpeningCase(true)

    await new Promise(resolve => setTimeout(resolve, 2000))

    const randomSkin = caseType.skins[Math.floor(Math.random() * caseType.skins.length)]
    setWonSkin(randomSkin)
    setInventory(prev => [...prev, randomSkin])
    setIsOpeningCase(false)
  }

  const startUpgrade = (skin: Skin) => {
    setSelectedSkin(skin)
    setUpgradeWheel({ spinning: true, result: null })

    setTimeout(() => {
      const success = Math.random() > 0.5
      if (success) {
        const upgradedPrice = Math.floor(skin.price * 1.5)
        const upgradedSkin: Skin = {
          ...skin,
          id: skin.id + '_upgraded',
          name: skin.name + ' ★',
          price: upgradedPrice,
          rarity: skin.rarity === 'common' ? 'uncommon' : 
                 skin.rarity === 'uncommon' ? 'rare' :
                 skin.rarity === 'rare' ? 'epic' : 
                 skin.rarity === 'epic' ? 'legendary' : 'legendary'
        }
        setInventory(prev => [...prev.filter(s => s.id !== skin.id), upgradedSkin])
        setUpgradeWheel({ spinning: false, result: upgradedSkin })
      } else {
        setInventory(prev => prev.filter(s => s.id !== skin.id))
        setUpgradeWheel({ spinning: false, result: null })
      }
    }, 3000)
  }

  const addBalance = () => {
    const amount = parseInt(adminBalance)
    if (!isNaN(amount) && amount > 0) {
      setBalance(prev => prev + amount)
      setAdminBalance('')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                CASE BATTLE
              </h1>
            </div>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant={activeTab === 'home' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('home')}
                className="relative overflow-hidden"
              >
                <Icon name="Home" size={16} className="mr-2" />
                Главная
              </Button>
              <Button 
                variant={activeTab === 'cases' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('cases')}
              >
                <Icon name="Package" size={16} className="mr-2" />
                Кейсы
              </Button>
              <Button 
                variant={activeTab === 'upgrade' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('upgrade')}
              >
                <Icon name="TrendingUp" size={16} className="mr-2" />
                Апгрейд
              </Button>
              <Button 
                variant={activeTab === 'inventory' ? 'default' : 'ghost'} 
                onClick={() => setActiveTab('inventory')}
              >
                <Icon name="Package2" size={16} className="mr-2" />
                Инвентарь
              </Button>
            </nav>

            <div className="flex items-center space-x-4">
              <Card className="px-4 py-2">
                <div className="flex items-center space-x-2">
                  <Icon name="Coins" size={20} className="text-primary" />
                  <span className="font-semibold text-lg">{balance}₽</span>
                </div>
              </Card>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => setActiveTab('profile')}
              >
                <Icon name="User" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8">
            <section className="text-center py-12">
              <div className="game-gradient rounded-xl p-1">
                <div className="bg-background rounded-lg p-8">
                  <h2 className="text-5xl font-bold mb-4">
                    Добро пожаловать в
                    <span className="game-gradient bg-clip-text text-transparent block">
                      CASE BATTLE
                    </span>
                  </h2>
                  <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    Открывай кейсы, получай редкие скины и улучшай их на колесе фортуны!
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button 
                      size="lg" 
                      className="game-gradient text-white font-semibold"
                      onClick={() => setActiveTab('cases')}
                    >
                      <Icon name="Package" size={20} className="mr-2" />
                      Открыть кейс
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      onClick={() => setActiveTab('upgrade')}
                    >
                      <Icon name="TrendingUp" size={20} className="mr-2" />
                      Апгрейд скинов
                    </Button>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-2xl font-bold mb-6 text-center">Популярные кейсы</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cases.slice(0, 3).map((caseType) => (
                  <Card key={caseType.id} className="case-card group">
                    <CardHeader>
                      <div className="text-6xl text-center mb-4 group-hover:animate-pulse">📦</div>
                      <CardTitle className="text-center">{caseType.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <p className="text-2xl font-bold text-primary mb-4">{caseType.price}₽</p>
                      <Button 
                        onClick={() => openCase(caseType)}
                        disabled={balance < caseType.price}
                        className="w-full"
                      >
                        Открыть кейс
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-center mb-8">Выбери свой кейс</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cases.map((caseType) => (
                <Card key={caseType.id} className="case-card">
                  <CardHeader>
                    <div className="text-8xl text-center mb-4">📦</div>
                    <CardTitle className="text-xl text-center">{caseType.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-primary">{caseType.price}₽</p>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Содержимое:</h4>
                        {caseType.skins.map((skin) => (
                          <div key={skin.id} className="flex items-center justify-between text-sm">
                            <span className="flex items-center">
                              <span className="mr-2">{skin.image}</span>
                              {skin.name}
                            </span>
                            <Badge style={{ backgroundColor: rarityColors[skin.rarity] }}>
                              {skin.rarity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <Button 
                        onClick={() => openCase(caseType)}
                        disabled={balance < caseType.price}
                        className="w-full"
                        size="lg"
                      >
                        {balance < caseType.price ? 'Недостаточно средств' : 'Открыть кейс'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'upgrade' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Колесо апгрейда</h2>
              <p className="text-lg text-muted-foreground">Поставь скин на кон и попробуй его улучшить!</p>
            </div>

            {upgradeWheel.spinning ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="relative">
                    <div className="w-32 h-32 mx-auto border-8 border-primary rounded-full animate-spin-slow relative">
                      <div className="absolute inset-2 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                        <span className="text-4xl">🎰</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-semibold mt-4">Колесо крутится...</p>
                  <p className="text-muted-foreground">Удача решает твою судьбу!</p>
                </CardContent>
              </Card>
            ) : upgradeWheel.result !== null ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="text-8xl mb-4">✨</div>
                  <h3 className="text-2xl font-bold mb-2">Поздравляем!</h3>
                  <p className="text-lg mb-4">Ты получил улучшенный скин:</p>
                  <Badge style={{ backgroundColor: rarityColors[upgradeWheel.result.rarity] }} className="text-lg p-2">
                    {upgradeWheel.result.image} {upgradeWheel.result.name}
                  </Badge>
                  <p className="text-xl font-bold text-primary mt-4">{upgradeWheel.result.price}₽</p>
                  <Button onClick={() => setUpgradeWheel({ spinning: false, result: null })} className="mt-4">
                    Продолжить
                  </Button>
                </CardContent>
              </Card>
            ) : upgradeWheel.result === null && selectedSkin ? (
              <Card className="max-w-md mx-auto">
                <CardContent className="p-8 text-center">
                  <div className="text-8xl mb-4">💔</div>
                  <h3 className="text-2xl font-bold mb-2">Неудача!</h3>
                  <p className="text-lg mb-4">К сожалению, скин был потерян...</p>
                  <Button onClick={() => setUpgradeWheel({ spinning: false, result: null })} className="mt-4">
                    Попробовать снова
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div>
                <h3 className="text-xl font-bold mb-4">Выбери скин для апгрейда:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {inventory.map((skin) => (
                    <Card key={skin.id} className="case-card">
                      <CardContent className="p-4 text-center">
                        <div className="text-4xl mb-2">{skin.image}</div>
                        <h4 className="font-semibold mb-2">{skin.name}</h4>
                        <Badge style={{ backgroundColor: rarityColors[skin.rarity] }} className="mb-2">
                          {skin.rarity}
                        </Badge>
                        <p className="text-lg font-bold text-primary mb-3">{skin.price}₽</p>
                        <Button onClick={() => startUpgrade(skin)} size="sm" className="w-full">
                          Апгрейдить
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {inventory.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-6xl mb-4">📦</div>
                      <p className="text-lg text-muted-foreground">У тебя пока нет скинов для апгрейда.</p>
                      <Button onClick={() => setActiveTab('cases')} className="mt-4">
                        Открыть кейс
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-center">Твой инвентарь</h2>
            
            {inventory.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {inventory.map((skin) => (
                  <Card key={skin.id} className="case-card">
                    <CardContent className="p-4 text-center">
                      <div className="text-4xl mb-2">{skin.image}</div>
                      <h4 className="font-semibold mb-2">{skin.name}</h4>
                      <Badge style={{ backgroundColor: rarityColors[skin.rarity] }} className="mb-2">
                        {skin.rarity}
                      </Badge>
                      <p className="text-lg font-bold text-primary">{skin.price}₽</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="text-8xl mb-4">🎒</div>
                  <h3 className="text-2xl font-bold mb-4">Инвентарь пуст</h3>
                  <p className="text-lg text-muted-foreground mb-6">Открой свой первый кейс и начни коллекцию!</p>
                  <Button onClick={() => setActiveTab('cases')} size="lg">
                    <Icon name="Package" size={20} className="mr-2" />
                    К кейсам
                  </Button>
                </CardContent>
              </Card>
            )}

            {inventory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Статистика инвентаря</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {inventory.length}
                      </div>
                      <div className="text-sm text-muted-foreground">Всего предметов</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {inventory.reduce((sum, skin) => sum + skin.price, 0)}₽
                      </div>
                      <div className="text-sm text-muted-foreground">Общая стоимость</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {inventory.filter(s => s.rarity === 'legendary').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Легендарных</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {inventory.filter(s => s.rarity === 'epic').length}
                      </div>
                      <div className="text-sm text-muted-foreground">Эпических</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Icon name="User" size={24} className="mr-2" />
                  Профиль игрока
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Игрок #1337</h3>
                    <p className="text-muted-foreground">Уровень: Новичок</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{balance}₽</div>
                      <div className="text-sm text-muted-foreground">Баланс</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{inventory.length}</div>
                      <div className="text-sm text-muted-foreground">Предметов</div>
                    </CardContent>
                  </Card>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => setAdminMode(!adminMode)}
                    className="w-full"
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    {adminMode ? 'Скрыть админку' : 'Админ панель'}
                  </Button>
                </div>

                {adminMode && (
                  <Card className="border-destructive">
                    <CardHeader>
                      <CardTitle className="text-destructive">
                        <Icon name="Shield" size={20} className="mr-2 inline" />
                        Админ панель
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="admin-balance">Добавить рубли</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="admin-balance"
                            type="number"
                            placeholder="Сумма"
                            value={adminBalance}
                            onChange={(e) => setAdminBalance(e.target.value)}
                          />
                          <Button onClick={addBalance}>
                            Добавить
                          </Button>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        💡 Админские функции для тестирования сайта
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <Dialog open={isOpeningCase} onOpenChange={setIsOpeningCase}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Открытие кейса</DialogTitle>
          </DialogHeader>
          <div className="text-center py-8">
            {isOpeningCase ? (
              <div className="space-y-4">
                <div className="text-8xl animate-case-open">📦</div>
                <p className="text-xl font-semibold">Открываем кейс...</p>
                <Progress value={100} className="animate-pulse" />
              </div>
            ) : wonSkin ? (
              <div className="space-y-4 animate-fade-in-up">
                <div className="text-8xl animate-glow">{wonSkin.image}</div>
                <h3 className="text-2xl font-bold">Поздравляем!</h3>
                <p className="text-lg">Ты получил:</p>
                <div className="p-4 bg-card rounded-lg">
                  <Badge 
                    style={{ backgroundColor: rarityColors[wonSkin.rarity] }} 
                    className="text-lg p-2"
                  >
                    {wonSkin.name}
                  </Badge>
                  <p className="text-xl font-bold text-primary mt-2">{wonSkin.price}₽</p>
                </div>
                <Button onClick={() => { setWonSkin(null); setSelectedCase(null) }}>
                  Забрать скин
                </Button>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Index