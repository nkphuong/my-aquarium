'use client';
import { useEffect } from "react";
import { useTankStore } from "@/app/stores/app/tank.store";
import TankCard from "./tank-card";
import CreateTankCardPlaceholder from "./create-tank-card-placeholder";

export default function TankCardList({ jwtToken, onCreateTank }: { jwtToken: string, onCreateTank: () => void }) {
    // const {data: session} = useSession();
    const tanks = useTankStore((state) => state.tanks)

    const loading = useTankStore((state) => state.isLoading)
    const error = useTankStore((state) => state.error)
    const fetchTanks = useTankStore((state) => state.fetchTanks)

    useEffect(() => {
        fetchTanks(jwtToken)
    }, [jwtToken, fetchTanks])

    if (loading && !tanks) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
            {tanks.map((tank) => (
                <TankCard key={tank.id} tank={tank} />
            ))}
            <CreateTankCardPlaceholder onCreateTank={onCreateTank} />
        </div>
    );
}