import { useState, useEffect } from 'react'
import { Shield, Users, Play, Home, Star, Calendar, Twitter, FileText, Mail, ArrowUpRight, ChevronDown } from 'lucide-react'
import { Button } from "/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "/components/ui/card"
import { Input } from "/components/ui/input"
import { Label } from "/components/ui/label"

declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom: boolean
        connect: (options?: { onlyIfTrusted: boolean }) => Promise<{ publicKey: string }>
        disconnect: () => Promise<void>
        on: (event: string, callback: (args: any) => void) => void
        publicKey?: {
          toString: () => string
        }
      }
    }
    ethereum?: any
  }
}

export default function MetaSageLanding() {
  const [activeSection, setActiveSection] = useState<'overview' | 'tokenomics' | 'roadmap' | 'whitepaper'>('overview')
  const [showLearnMore, setShowLearnMore] = useState(false)
  const [email, setEmail] = useState('')
  const [xUsername, setXUsername] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [walletType, setWalletType] = useState<'phantom' | 'walletconnect' | null>(null)
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [tokenStats, setTokenStats] = useState({
    price: '$0.042',
    marketCap: '$42M',
    holders: '12,459',
    volume: '$1.2M',
    change: '+2.4%'
  })

  // Simulate live token stats updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() * 10 - 5).toFixed(2)
      setTokenStats(prev => ({
        ...prev,
        price: `$${(Math.random() * 0.001 + 0.041).toFixed(3)}`,
        volume: `$${(Math.random() * 0.2 + 1.1).toFixed(1)}M`,
        change: `${parseFloat(change) > 0 ? '+' : ''}${change}%`
      }))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const connectPhantom = async () => {
    if (window.phantom?.solana?.isPhantom) {
      try {
        const response = await window.phantom.solana.connect()
        setWalletAddress(response.publicKey.toString())
        setWalletType('phantom')
        setShowWalletOptions(false)
      } catch (error) {
        console.error('Failed to connect Phantom wallet:', error)
      }
    } else {
      window.open('https://phantom.app/', '_blank')
    }
  }

  const connectWalletConnect = () => {
    // In a real implementation, this would show WalletConnect QR modal
    setWalletAddress('0x742d35Cc6634C0532925a3b844Bc454e4438f44e')
    setWalletType('walletconnect')
    setShowWalletOptions(false)
  }

  const disconnectWallet = () => {
    setWalletAddress(null)
    setWalletType(null)
  }

  const formatWalletAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const renderWalletButton = () => {
    if (walletAddress) {
      return (
        <div className="flex items-center space-x-2">
          <span className="text-sm bg-gray-700 px-3 py-1 rounded-full flex items-center">
            {walletType === 'phantom' ? (
              <img src="https://phantom.app/favicon.ico" alt="Phantom" className="w-4 h-4 mr-2" />
            ) : (
              <img src="https://walletconnect.com/walletconnect-logo.png" alt="WalletConnect" className="w-4 h-4 mr-2" />
            )}
            {formatWalletAddress(walletAddress)}
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-gray-700 hover:bg-gray-600"
            onClick={disconnectWallet}
          >
            Disconnect
          </Button>
        </div>
      )
    }

    return (
      <div className="relative">
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-gray-700 hover:bg-gray-600 flex items-center"
          onClick={() => setShowWalletOptions(!showWalletOptions)}
        >
          Connect Wallet
          <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showWalletOptions ? 'rotate-180' : ''}`} />
        </Button>
        
        {showWalletOptions && (
          <div className="absolute right-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
            <div className="py-1">
              <button
                onClick={connectPhantom}
                className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
              >
                <img src="https://phantom.app/favicon.ico" alt="Phantom" className="w-5 h-5 mr-2" />
                Phantom Wallet
              </button>
              <button
                onClick={connectWalletConnect}
                className="flex items-center w-full px-4 py-2 text-left text-sm hover:bg-gray-700"
              >
                <img src="https://walletconnect.com/walletconnect-logo.png" alt="WalletConnect" className="w-5 h-5 mr-2" />
                WalletConnect
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "SageChain",
      description: "Decentralized blockchain infrastructure for AI operations."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "AI Agents",
      description: "Autonomous agents that perform tasks and make decisions."
    },
    {
      icon: <Play className="w-6 h-6" />,
      title: "MetaStudio",
      description: "Development environment for AI models and agents."
    },
    {
      icon: <Home className="w-6 h-6" />,
      title: "AI Wallet",
      description: "Secure digital wallet for AI assets and identity."
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: "Decentralized Learning",
      description: "Privacy-preserving distributed machine learning."
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Token Utility",
      description: "Native token for transactions and governance."
    }
  ]

  const tokenomicsData = [
    { category: "Community Incentives", allocation: "25%", vesting: "Linear release over 48 months" },
    { category: "Team & Founders", allocation: "15%", vesting: "12-month cliff, then 24-month vesting" },
    { category: "Investors (Seed/Private)", allocation: "15%", vesting: "6-month cliff, then linear over 18 months" },
    { category: "Ecosystem Development", allocation: "20%", vesting: "Strategic release over 36 months" },
    { category: "Treasury", allocation: "10%", vesting: "DAO-governed, unlocked" },
    { category: "Partnerships & Advisors", allocation: "5%", vesting: "3-month cliff, 12-month vesting" },
    { category: "Liquidity & Exchanges", allocation: "10%", vesting: "30% at TGE, rest unlocked over 12 months" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ email, xUsername })
    setSubmitted(true)
    setEmail('')
    setXUsername('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img 
                src="https://pbs.twimg.com/profile_images/1925995723666939905/XPiuRVeK.jpg" 
                alt="MetaSage AI Logo"
                className="w-10 h-10 rounded-full object-cover"
              />
              <h1 className="text-xl font-bold">MetaSage AI</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => setActiveSection('overview')}
                className={`py-2 px-1 font-medium ${activeSection === 'overview' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-100'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveSection('tokenomics')}
                className={`py-2 px-1 font-medium ${activeSection === 'tokenomics' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-100'}`}
              >
                Tokenomics
              </button>
              <button 
                onClick={() => setActiveSection('roadmap')}
                className={`py-2 px-1 font-medium ${activeSection === 'roadmap' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-100'}`}
              >
                Roadmap
              </button>
              <button 
                onClick={() => setActiveSection('whitepaper')}
                className={`py-2 px-1 font-medium ${activeSection === 'whitepaper' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-100'}`}
              >
                Whitepaper
              </button>
            </nav>
            {renderWalletButton()}
          </div>
        </div>
      </header>

      {/* On-chain Activity Tracker (floating widget) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="bg-gray-800 border-gray-700 w-72">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">$SAGE</CardTitle>
              <span className={`text-sm px-2 py-1 rounded-full ${tokenStats.change.startsWith('+') ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'}`}>
                {tokenStats.change}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-gray-400">Price</p>
                <p className="font-medium">{tokenStats.price}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Market Cap</p>
                <p className="font-medium">{tokenStats.marketCap}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Holders</p>
                <p className="font-medium">{tokenStats.holders}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">24h Volume</p>
                <p className="font-medium">{tokenStats.volume}</p>
              </div>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-400 hover:text-blue-300">
              View on Explorer <ArrowUpRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-16">
            <div className="text-center py-12 md:py-20">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Decentralized AI Infrastructure
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 mb-8">
                Building the future of autonomous AI ecosystems
              </p>
              <div className="flex justify-center gap-4">
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-500"
                  onClick={() => setShowLearnMore(!showLearnMore)}
                >
                  Learn More
                </Button>
                <Button variant="outline" size="lg" className="border-gray-600 hover:bg-gray-800">
                  Join Waitlist
                </Button>
              </div>

              {showLearnMore && (
                <Card className="mt-8 max-w-md mx-auto bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Stay Updated</CardTitle>
                    <CardDescription className="text-gray-400">
                      Enter your details to get early access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {submitted ? (
                      <div className="text-center py-4 text-green-400">
                        Thank you! We'll be in touch soon.
                      </div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="your@email.com"
                              className="pl-10 bg-gray-700 border-gray-600"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="xUsername">X (Twitter) Username</Label>
                          <div className="relative">
                            <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="xUsername"
                              placeholder="@yourusername"
                              className="pl-10 bg-gray-700 border-gray-600"
                              value={xUsername}
                              onChange={(e) => setXUsername(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500">
                          Submit
                        </Button>
                      </form>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="py-12 md:py-20">
              <h2 className="text-3xl font-bold text-center mb-12">
                Core Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-400/50 transition-colors">
                    <CardHeader className="flex flex-row items-center space-x-4">
                      <div className="p-2 rounded-full bg-blue-900/30 text-blue-400">
                        {feature.icon}
                      </div>
                      <CardTitle>{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tokenomics Section */}
        {activeSection === 'tokenomics' && (
          <div className="py-12 md:py-20">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Tokenomics Overview
              </h2>
              
              <Card className="bg-gray-800 border-gray-700 mb-8">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="px-6 py-3 text-left font-medium">Category</th>
                          <th className="px-6 py-3 text-left font-medium">Allocation</th>
                          <th className="px-6 py-3 text-left font-medium">Vesting</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tokenomicsData.map((item, index) => (
                          <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/50">
                            <td className="px-6 py-4">{item.category}</td>
                            <td className="px-6 py-4">{item.allocation}</td>
                            <td className="px-6 py-4">{item.vesting}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Total Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">1,000,000,000 $SAGE</p>
                  </CardContent>
                </Card>

                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle>Initial Circulating Supply</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">~12-15% at TGE</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}

        {/* Roadmap Section */}
        {activeSection === 'roadmap' && (
          <div className="py-12 md:py-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Development Roadmap
            </h2>
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-0.5 h-full bg-blue-400/20"></div>
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-blue-400 -ml-1.5"></div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2">Q2 2025</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">SageChain testnet launch</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">Core AI agent framework development</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">Initial MetaStudio alpha release</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-0.5 h-full bg-blue-400/20"></div>
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-blue-400 -ml-1.5"></div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2">Q3 2025</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">Mainnet launch with staking</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">AI Agent marketplace beta</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">Decentralized learning protocol v1</span>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-0 w-0.5 h-full bg-blue-400/20"></div>
                <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-blue-400 -ml-1.5"></div>
                <div className="ml-6">
                  <h3 className="text-xl font-bold mb-2">Q1 2026</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">Full ecosystem integration</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">Cross-chain interoperability</span>
                    </li>
                    <li className="flex items-start">
                      <span className="flex-shrink-0 w-1.5 h-1.5 mt-2.5 rounded-full bg-blue-400 mr-2"></span>
                      <span className="text-gray-400">Enterprise adoption program</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Whitepaper Section */}
        {activeSection === 'whitepaper' && (
          <div className="py-12 md:py-20">
            <h2 className="text-3xl font-bold text-center mb-12">
              Whitepaper
            </h2>
            <div className="max-w-3xl mx-auto">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <FileText className="w-6 h-6 mr-2 text-blue-400" />
                    MetaSage Technical Whitepaper
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-gray-400">
                      Our whitepaper details the technical architecture, economic model, and governance framework of the MetaSage ecosystem.
                    </p>
                    <div className="pt-4">
                      <a 
                        href="https://eu.docworkspace.com/d/sIJKFnIS2AvWz7sEG?sa=601.1074" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-block"
                      >
                        <Button className="bg-blue-600 hover:bg-blue-500">
                          View Whitepaper
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-gray-800 py-8 border-t border-gray-700 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <img 
                src="https://pbs.twimg.com/profile_images/1925995723666939905/XPiuRVeK.jpg" 
                alt="MetaSage AI Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <p className="text-gray-400">© 2024 MetaSage AI. All rights reserved.</p>
            </div>
            <div className="flex space-x-4">
              <a href="https://twitter.com/metasageai" target="_blank" rel="noopener noreferrer">
                <Twitter className="w-5 h-5 text-gray-400 hover:text-blue-400" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
