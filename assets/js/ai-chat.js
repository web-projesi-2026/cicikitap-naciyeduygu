/* ═══════════════════════════════════════════════════════════════
   NACIYE DUYGU — ai-chat.js
   Yapay Zeka Sohbet Özelliği
   OpenAI API (gpt-4.1-mini) ile entegrasyon
   ═══════════════════════════════════════════════════════════════ */

// ── SISTEM PROMPTU (Naciye Duygu hakkında bilgi) ──────────────────
const SYSTEM_PROMPT = `Sen Naciye Duygu'nun kişisel portfolyo sitesindeki yapay zeka asistanısın.
Görevin: Ziyaretçilerin Naciye Duygu hakkında sordukları soruları yanıtlamak.

Naciye Duygu hakkında bilgiler:
- Bilgisayar Programcılığı öğrencisi (KAEÜ TBMYO, 2024-2026)
- Beceriler: HTML5, CSS3/Tailwind, JavaScript, PHP/MySQL, C#/.NET, Git/GitHub, Responsive Tasarım, UI/UX
- Deneyim: KAEÜ'de stajyer geliştirici/tasarımcı (2024'ten itibaren), web projeleri ve poster/afiş tasarımı
- Projeler: E-Ticaret Sitesi (donanım parça alım-satım), Portfolyo Sitesi, Yapay Zeka Asistan entegrasyonu
- İlgi alanları: Çevredeki sorunları gözlemleyip proje geliştirme, düşünmek, tasarlamak, soyut-somut gözlem
- İletişim: Portfolyo sitesindeki iletişim formu üzerinden ulaşılabilir

Kurallar:
- Türkçe veya İngilizce sorulara aynı dilde yanıt ver
- Samimi, yardımsever ve profesyonel ol
- Bilmediğin bir şey sorulursa dürüstçe belirt
- Yanıtları kısa ve net tut (maksimum 3-4 cümle)
- Emoji kullanabilirsin ama abartma`;

// ── API ENDPOINT ──────────────────────────────────────────────────
// Not: Gerçek projede API anahtarı backend'de tutulmalıdır.
// Bu demo için proxy endpoint kullanılıyor.
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

// Sohbet geçmişi
let chatHistory = [];

// ── MESAJ GÖNDER ──────────────────────────────────────────────────
window.sendMessage = async function() {
  const input   = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSendBtn');
  const text    = input.value.trim();

  if (!text || sendBtn.disabled) return;

  // Kullanıcı mesajını ekle
  appendMessage('user', text);
  input.value = '';
  input.style.height = 'auto';
  chatHistory.push({ role: 'user', content: text });

  // Öneri chip'lerini gizle
  const suggestions = document.getElementById('chatSuggestions');
  if (suggestions) suggestions.style.display = 'none';

  // Gönder butonunu devre dışı bırak
  sendBtn.disabled = true;

  // Yazıyor göstergesi
  const typingId = showTyping();

  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.AI_API_KEY || ''}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory.slice(-10) // Son 10 mesajı gönder (bağlam sınırı)
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });

    removeTyping(typingId);

    if (!response.ok) {
      throw new Error(`API hatası: ${response.status}`);
    }

    const data    = await response.json();
    const aiReply = data.choices?.[0]?.message?.content || 'Üzgünüm, bir yanıt oluşturamadım.';

    chatHistory.push({ role: 'assistant', content: aiReply });
    appendMessage('ai', aiReply);

  } catch (err) {
    removeTyping(typingId);
    console.error('AI Chat hatası:', err);

    // API anahtarı yoksa demo yanıt ver
    const demoReply = getDemoReply(text);
    chatHistory.push({ role: 'assistant', content: demoReply });
    appendMessage('ai', demoReply);
  }

  sendBtn.disabled = false;
  input.focus();
};

// ── DEMO YANIT (API anahtarı olmadığında) ─────────────────────────
function getDemoReply(question) {
  const q = question.toLowerCase();

  if (q.includes('beceri') || q.includes('dil') || q.includes('teknoloji') || q.includes('skill')) {
    return 'Naciye Duygu; HTML5, CSS3/Tailwind, JavaScript, PHP/MySQL, C#/.NET ve Git/GitHub teknolojilerini kullanmaktadır. Ayrıca responsive tasarım ve UI/UX konularında da deneyimi vardır. 💻';
  }
  if (q.includes('proje') || q.includes('project')) {
    return 'Naciye\'nin öne çıkan projeleri arasında bir E-Ticaret Sitesi (donanım parça alım-satım), bu portfolyo sitesi ve yapay zeka asistan entegrasyonu yer almaktadır. 🚀';
  }
  if (q.includes('eğitim') || q.includes('okul') || q.includes('üniversite') || q.includes('education')) {
    return 'Naciye Duygu, KAEÜ TBMYO\'da Bilgisayar Programcılığı okumaktadır (2024-2026). Algoritmalar, Veri Yapıları ve Web Teknolojileri odaklı eğitim almaktadır. 🎓';
  }
  if (q.includes('iletişim') || q.includes('contact') || q.includes('ulaş')) {
    return 'Naciye ile iletişime geçmek için portfolyo sitesindeki İletişim bölümünü kullanabilirsiniz. Formu doldurarak mesajınızı iletebilirsiniz. 📬';
  }
  if (q.includes('deneyim') || q.includes('staj') || q.includes('experience')) {
    return 'Naciye, KAEÜ\'de stajyer geliştirici ve tasarımcı olarak görev yapmaktadır (2024\'ten itibaren). Web projeleri geliştirme ve kurumsal poster/afiş tasarımı konularında deneyim kazanmıştır. 🏢';
  }
  if (q.includes('merhaba') || q.includes('selam') || q.includes('hello') || q.includes('hi')) {
    return 'Merhaba! 👋 Ben Naciye Duygu\'nun AI asistanıyım. Portfolyo, beceriler, projeler veya eğitim hakkında sorularınızı yanıtlamaktan memnuniyet duyarım!';
  }

  return 'Naciye Duygu, KAEÜ\'de Bilgisayar Programcılığı okuyan, web geliştirme ve tasarım konularında tutkulu bir öğrencidir. Daha spesifik bir soru sormak ister misiniz? 😊';
}

// ── MESAJ EKLEME ──────────────────────────────────────────────────
function appendMessage(role, text) {
  const container = document.getElementById('chatMessages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `chat-msg ${role}`;

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.textContent = role === 'ai' ? 'AI' : 'Sen';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  // Satır sonlarını <br> ile göster
  bubble.innerHTML = escapeHtml(text).replace(/\n/g, '<br>');

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  container.appendChild(msgDiv);

  // Aşağı kaydır
  container.scrollTop = container.scrollHeight;
}

// ── YAZMA GÖSTERGESİ ──────────────────────────────────────────────
function showTyping() {
  const container = document.getElementById('chatMessages');
  if (!container) return null;

  const id     = 'typing-' + Date.now();
  const msgDiv = document.createElement('div');
  msgDiv.className = 'chat-msg ai';
  msgDiv.id = id;

  const avatar = document.createElement('div');
  avatar.className = 'chat-avatar';
  avatar.textContent = 'AI';

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble';
  bubble.innerHTML = `<div class="chat-typing">
    <span></span><span></span><span></span>
  </div>`;

  msgDiv.appendChild(avatar);
  msgDiv.appendChild(bubble);
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;

  return id;
}

function removeTyping(id) {
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.remove();
}

// ── HTML ESCAPE ───────────────────────────────────────────────────
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── ENTER İLE GÖNDER ──────────────────────────────────────────────
window.handleChatKey = function(e) {
  // Shift+Enter: yeni satır, sadece Enter: gönder
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    window.sendMessage();
  }
};

// ── TEXTAREA OTO BOYUT ────────────────────────────────────────────
window.autoResize = function(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 140) + 'px';
};

// ── ÖNERİ CHİP ────────────────────────────────────────────────────
window.sendSuggestion = function(chip) {
  const input = document.getElementById('chatInput');
  if (!input) return;
  input.value = chip.textContent.trim();
  window.sendMessage();
};
