import { Button } from "@/components/ui/button"

export function BlockchainMattersSection() {
  return (
    <section className="py-20 px-6 relative">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold">
              Why Blockchain <span className="text-cyan-400">Matters</span>
            </h2>

            <p className="text-gray-400 text-lg leading-relaxed text-pretty">
              Blockchain is revolutionizing how we handle data, transactions, and trust. By eliminating intermediaries
              and creating secure, transparent systems, blockchain is laying the foundation for a more efficient and
              fair digital future.
            </p>

            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full px-8 py-6">Read More</Button>
          </div>

          <div className="relative">
            <img src="/isometric-blockchain-network-servers-connected-nod.jpg" alt="Blockchain network" className="w-full h-auto" />
          </div>
        </div>
      </div>
    </section>
  )
}
