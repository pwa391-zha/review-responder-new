import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for row updates
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nodeId: string }> } // 👈 ၁။ ဒီနေရာမှာ Promise ဖြစ်အောင် ပြင်လိုက်တယ်
) {
  const { nodeId } = await params; // 👈 ၂။ ဒီနေရာမှာ await ခံပြီးမှ nodeId ကို ဆွဲထုတ်လိုက်တယ်
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get('utm_src') || 'all'; // digital, print or all

  try {
    // 1. Fetch the original node target redirect url
    const { data: node, error } = await supabase
      .from('qr_nodes')
      .select('*')
      .eq('id', nodeId)
      .single();

    if (error || !node) {
      return NextResponse.json({ error: 'Node not found' }, { status: 404 });
    }

    // 2. Real-time Increment Logic based on channel tracking
    let updateData: any = {
      total_scans: node.total_scans + 1
    };

    if (source === 'smartnode_digital') {
      updateData.digital_scans = node.digital_scans + 1;
    } else if (source === 'smartnode_print') {
      updateData.print_scans = node.print_scans + 1;
    }

    // 3. Update the database (This triggers Supabase Realtime broadcast)
    await supabase
      .from('qr_nodes')
      .update(updateData)
      .eq('id', nodeId);

    // 4. Smooth Redirect back to client's original feedback link
    return NextResponse.redirect(new URL(node.base_url));

  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}