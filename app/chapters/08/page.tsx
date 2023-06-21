'use client'

import Card from '../../components/Card'
import LightedCube from './LightedCube'
import LightedCube_animation from './LightedCube_animation'
import LightedCube_ambient from './LightedCube_ambient'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={LightedCube.name}>
                <LightedCube />
            </Card>
            <Card name={LightedCube_animation.name}>
                <LightedCube_animation />
            </Card>
            <Card name={LightedCube_ambient.name}>
                <LightedCube_ambient />
            </Card>
            {/* <Card name={ClickedPoints.name}>
                <ClickedPoints />
            </Card> */}
            {/* <Card name={ColoredPoints.name}>
                <ColoredPoints />
            </Card> */}
        </div>
    </div>
}