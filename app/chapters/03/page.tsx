'use client'

import Card from '../../components/Card'
import MultiPoint from './MultiPoint'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={MultiPoint.name}>
                <MultiPoint />
            </Card>
            {/* <Card name={HelloPoint1.name}>
                <HelloPoint1 />
            </Card>
            <Card name={HelloPoint2.name}>
                <HelloPoint2 />
            </Card>
            <Card name={ClickedPoints.name}>
                <ClickedPoints />
            </Card>
            <Card name={ColoredPoints.name}>
            </Card> */}
        </div>
    </div>
}