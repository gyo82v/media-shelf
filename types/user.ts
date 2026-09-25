export interface UserProfile {
    uid : string
    email : string | null
    displayName : string | null
    createdAt : unknown
    jadeLilyCredit : number
    jadeLilyTotalOrders : number 
    jadeLilyCart : []
    jadeLilyPastOrders : []
    jadeLilyCreditUsed : number
    mediaShelf : {
        settings: {
            darkmode: boolean
            language: string
        }
    }
    nextillApp: {
        settings: {
            darkmode: boolean
            language: string
            dayActive: boolean
            dayDate: string | null
            currency: string
            balanceEnabled: boolean
            ticketEnabled: boolean
            receiptEnabled: boolean
            disableMotion: boolean
            soundEnabled: boolean
            discountEnabled: boolean
            paymentMethodSelectionEnabled: boolean
        }
        dayCycle: {
            active: boolean
            startedAt: unknown | null
            endedAt: unknown | null
            openingBalance: number | null
            closingBalance: number | null
            dayKey: string | null
            nextTicketNumber: number
        }
    }
}

export interface MediaItem {
    id: string
    name: string
    type: "movie" | "book" | "game" | "tvShow"
    status: "completed" | "inProgress" | "wishList"

    createdAt: unknown
    updatedAt: unknown
    startedAt: unknown | null
    finishedAt: unknown | null

    description: string
    genre: string
    reviewProfile: string
    image: string
    country?: string
    year?: number

    starRating: number | null
    notes: string

    reviewScore: {
        criteria: Record<string, number>
    }

    seasons?: {
        number: number
        starRating: number | null
        reviewScore?: {
            criteria: Record<string, number>
        }
    }[]
}