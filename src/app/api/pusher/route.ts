import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher-server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event, data } = body;

    if (!event || !data) {
      return NextResponse.json({ error: 'Missing event or data' }, { status: 400 });
    }

    // Trigger Pusher event to 'viewer' channel
    await pusherServer.trigger('viewer', event, data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Pusher error:', error);
    return NextResponse.json({ error: 'Failed to trigger event' }, { status: 500 });
  }
}
