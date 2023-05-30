'use client'

import Card from '../../components/Card'
import HelloCanvas from './HelloCanvas'
import HelloPoint1 from './HelloPoint1'
import HelloPoint2 from './HelloPoint2'
import ClickedPoints from './ClickedPoints'

export default function Chapter() {
    return <div className="p-6">
        <div className="flex flex-wrap justify-center">
            <Card name={HelloCanvas.name}>
                <HelloCanvas />
            </Card>
            <Card name={HelloPoint1.name}>
                <HelloPoint1 />
            </Card>
            <Card name={HelloPoint2.name}>
                <HelloPoint2 />
            </Card>
            <Card name={ClickedPoints.name}>
                <ClickedPoints />
            </Card>
        </div>
    </div>
}