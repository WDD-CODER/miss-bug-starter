const { useState, useEffect, useRef } = React
import { eventBusService } from '../services/event-bus.service.js'

export function UserMsg() {
	const [msg, setMsg] = useState()
	const timeoutIdRef = useRef()

	useEffect(() => {
		const unsubscribe = eventBusService.on('show-user-msg', msg => {
			setMsg(msg)
            clearTimeout(timeoutIdRef.current)
			timeoutIdRef.current = setTimeout(closeMsg, 2000)
		})
		return unsubscribe
	}, [])
    
	function closeMsg() {
		setMsg(null)
	}

	if (!msg) return <div></div>
	return <section className={`user-msg ${msg.type}`}>
        <span>{msg.txt}</span>
        <button onClick={closeMsg}>x</button>
    </section>
}
