import { Box, Shield, Search, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"

const features = [
  {
    icon: Box,
    title: "Decentralization",
    description: "No single entity controls the system",
  },
  {
    icon: Shield,
    title: "Security",
    description: "Encrypted and tamper-proof data",
  },
  {
    icon: Search,
    title: "Transparency",
    description: "Public, accountable transactions",
  },
  {
    icon: Zap,
    title: "Efficiency",
    description: "Faster, cost-effective processes",
  },
]

export function WhyBlockchainSection() {
  return (
    <section className="py-20 px-6 relative" id="why">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Why <span className="text-cyan-400">Blockchain</span>?
          </h2>
          <p className="text-gray-400 text-lg">
            Blockchain is redefining trust in the digital world. Here's why it matters.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-[#0f1f3a]/50 border-cyan-500/20 p-8 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="mb-6 w-14 h-14 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <feature.icon className="w-7 h-7 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
