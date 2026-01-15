'use client';
import { useEffect } from "react";
import { useTankStore } from "@/app/stores/app/tank.store";
import TankCard from "./tank-card";
import CreateTankCardPlaceholder from "./create-tank-card-placeholder";

export default function TankCardList({ jwtToken, onCreateTank, keyword, type, style }: {
    jwtToken: string,
    onCreateTank: () => void,
    keyword?: string,
    type?: string,
    style?: string
}) {
    // const {data: session} = useSession();
    const tanks = useTankStore((state) => state.tanks)

    const loading = useTankStore((state) => state.isLoading)
    const error = useTankStore((state) => state.error)
    const fetchTanks = useTankStore((state) => state.fetchTanks)

    useEffect(() => {
        fetchTanks(jwtToken, keyword, type, style)
    }, [jwtToken, fetchTanks])

    if (loading && !tanks) return <div>Loading...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tanks.map((tank) => (
                <TankCard key={tank.id} tank={tank} />
            ))}
            <CreateTankCardPlaceholder onCreateTank={onCreateTank} />
        </div>
    );
}