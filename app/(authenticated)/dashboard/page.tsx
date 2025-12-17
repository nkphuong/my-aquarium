"use client"

import {
  DashboardHero,
  StatsCards,
  TankCard,
  TanksSection,
  ActivitySection,
  CareSuggestions,
} from "@/components/dashboard"

/**
 * Dashboard Page
 * Main aquarist dashboard with tanks overview, activity, and care suggestions
 */
export default function DashboardPage() {
  // Mock data - in production this would come from API/store
  const mockTanks = [
    {
      id: "1",
      name: "55g Planted Community",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBMpfliVZBIoPCjxQjGHx1hC5Jesi2QED30cTQwjCdK_BKxQJ4KHHABMB5Po83o06baaaDr61iF1b97SG82U8KGpw__JlUJodNqZVrF-hCSaIJ3hvGP1LQ_yKvDFfwnAn8oegh3yvbdieUMnownRBuwqpk4CiQJqPtnEAexA30g4HUvdZ1Yq9wigortpOadeWX4jPWrtoGMBr-ajObvceVBWAYETo-jSM1pB-cgoK-5w9CazEVejJOrdvgT4ZAyIbfn2yk018Km1l0",
      status: "healthy" as const,
      lastTested: "2 days ago",
      parameters: [
        { label: "Temp", value: "78°", status: "good" as const },
        { label: "pH", value: "6.8", status: "good" as const },
        { label: "NO3", value: "10", status: "good" as const },
      ],
      inhabitants: [
        {
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBDQloq6cpGaMFnLkfaAkBDBYe_kw5zP-U0kmykg_ySZLBYTQBNUcoaZNGs8672LqfbZ7zEBaMGF96Mj8-0LDQXFHCIx_5yfpInkdyukwwTrX7qOTmldTKt6hRzxCoKbrl9FrlKaNqRiRcdAjofOYcbVGBqho9VHQ2Oi-3Vus5E5YffmRGwhjkgbeXSOrI6_Osm8zOqWqt13xRz7XpnKT1jY9aFMDrzHwYj6Xjq-hlLmKdAOEAjGAFV_I99_WCb4FAwM2C9YgJoMwM",
          alt: "Tetra fish",
        },
        {
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBWZXk8zr1NACuOG7gRGmjAwgQylc3VhO8tISLd8TUAxNSeIiKY3DUqIU483HSnzKOZxhlBk4YjMHfOmwmPxKdSRkkcfBtgkDEla1QMrGAAomXwSENZSftqFRTzbvPla0XCS4Au42JFH5ayAZE1ogXoeZzc3_RKpH-zCR6yj76Xn16X2GBxiHqveL3HtA5bMiGD1UzDvgKrje6SZY4RQcxH22hijmki33CxPlSaWXd9kWEQId8ubzFMINRpeXZaN3iicfOmD9SwUCw",
          alt: "Guppy fish",
        },
      ],
      totalInhabitants: 14,
    },
    {
      id: "2",
      name: "20g Nano Reef",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBri9KANXjAJT4RTRSbPgNRs_K9bu6grnMfb3hGXfPIrwQJDLGkFdJjGVEciqbQkrYdKkdFT7q6rt55YYuWDsTfi5douSzuWHB9mqsLopdgdWwjHoa3js4HmI6tLpmf-BfATj-3GxuhDJOm-I5RT1pcZCwjgmVTBdrxpk7DxVKdzsFiIGnoqeX4emcaIKa3UKq-Yewu-VS1I24IivgC1B0MgAXSVXU-BtB_jVNSAdBcfFtZS2brZs9U-yg4ot113eoU05vEkDbZS_M",
      status: "danger" as const,
      statusLabel: "Check Filter",
      lastTested: "Yesterday",
      parameters: [
        { label: "Temp", value: "79°", status: "good" as const },
        { label: "Salinity", value: "1.026", status: "good" as const },
        { label: "Alk", value: "8.5", status: "good" as const },
      ],
      inhabitants: [
        {
          imageUrl:
            "https://lh3.googleusercontent.com/aida-public/AB6AXuC9zp1O_NDNrfGOHhA9-GN7hPuiNHiVs77zhjo_Ri4hIis0K8SubsoeK-z_oIl7NtL_4wyR9Q6yvi8IdJ8Gj57juodoMJ13wtRiDfuz7dAY5e93WGUNx9Aq2idprqSiVdRMcIT8Vu1aDL1q6jtfvtfKVcCWgdXxBcZzyDOGbhZ_VAV1FOoKhZ1iwSccSqEoEnY4gOAwcZyt-joRzPIN3hOifkPe__67T6mi-_8IoAhlphcxPl_s82D4Mjl1cYN5O2Pp7Pyw4tfKy44",
          alt: "Clownfish",
        },
      ],
      totalInhabitants: 5,
    },
  ]

  const mockActivities = [
    {
      id: "1",
      type: "testing" as const,
      title: "Water Parameters Logged",
      description: "Ammonia: 0, Nitrite: 0, Nitrate: 10ppm for 55g Planted.",
      timestamp: "2h ago",
    },
    {
      id: "2",
      type: "feeding" as const,
      title: "Feeding Time",
      description: "Fed Frozen Brine Shrimp to Nano Reef inhabitants.",
      timestamp: "5h ago",
    },
    {
      id: "3",
      type: "maintenance" as const,
      title: "Plant Trimming",
      description: "Trimmed Rotala rotundifolia in the background.",
      timestamp: "Yesterday",
    },
  ]

  return (
    <div className="max-w-[1200px] mx-auto flex flex-col gap-8 pb-20">
      {/* Hero Section */}
      <DashboardHero userName="Aquarist" pendingTasks={2} />

      {/* Stats Cards */}
      <StatsCards
        totalTanks={3}
        newTanks={1}
        activeAlerts={1}
        nextWaterChange={{ date: "Tomorrow", tankName: "Reef Tank", percentage: 20 }}
        totalInhabitants={42}
        newBorn={2}
      />

      {/* Tanks Section */}
      <TanksSection>
        {mockTanks.map((tank) => (
          <TankCard key={tank.id} {...tank} />
        ))}
      </TanksSection>

      {/* Activity and Care Suggestions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivitySection activities={mockActivities} />
        </div>
        <div>
          <CareSuggestions />
        </div>
      </div>
    </div>
  )
}
