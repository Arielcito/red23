export interface RewardConfiguration {
  id: string
  dailyPrizeAmount: string
  monthlyPrizeAmount: string
  dailyPrizeDrawDate?: Date
  monthlyPrizeDrawDate?: Date
  useCustomDates: boolean
  createdAt: Date
  updatedAt: Date
}

export interface RewardDateSettings {
  dailyPrizeDrawDate?: string
  monthlyPrizeDrawDate?: string
  useCustomDates: boolean
}

export interface UpdateRewardDatesRequest {
  dailyPrizeDrawDate?: string
  monthlyPrizeDrawDate?: string
  useCustomDates?: boolean
  dailyPrizeAmount?: string
  monthlyPrizeAmount?: string
}