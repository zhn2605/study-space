import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import type { JSX } from "react/jsx-dev-runtime";
import { Box3, Group, Vector3 } from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import characterUrl from "/assets/Goblin_Male.glb?url";

type Props = {
    x: number,
    y: number,
    z: number,
    rotY: number,
    isIdle: boolean;
    scale?: number;
};

export function PlayerCharacter({ x, y, z, rotY, isIdle, scale = 1 }: Props): JSX.Element {
    const group = useRef<Group>(null);
    const { scene, animations } = useGLTF(characterUrl);
    const cloned = useMemo(() => cloneSkinned(scene), [scene]);
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        const box = new Box3().setFromObject(cloned);
        const size = box.getSize(new Vector3());
        console.log("[PlayerCharacter] world size:", size.toArray(), "anims:", animations.map((a) => a.name));
    }, [cloned, animations]);

    useEffect(() => {
        const target = isIdle ? actions["CharacterArmature|Idle"] : actions["CharacterArmature|Run"];
        if (!target) return;
        target.reset().fadeIn(0.15).play();
        return () => {
            target.fadeOut(0.15);
        };
    }, [isIdle, actions]);

    return (
        <group ref={group} position={[x, y, z]} rotation={[0, rotY, 0]} scale={scale}>
            <primitive object={cloned} />
        </group>
    );
}

useGLTF.preload(characterUrl);
