import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { ArrowUpRight, ArrowDown, ArrowRight, Check, ChevronDown, Droplets, ShieldCheck, Sparkles, Wind, Menu, X, Instagram, MessageCircle, CircleCheck, Gem } from "lucide-react";
import { Button } from "@/components/ui/button";
import hero from "@/assets/apollo-hero.jpg";
import polishing from "@/assets/apollo-polishing.jpg";
import interior from "@/assets/apollo-interior.jpg";
import logo from "@/assets/apollo-logo.png.asset.json";

const instagram = "https://www.instagram.com/apollo_estetica_automotiva/";
const whatsapp = (service?: string) => `https://wa.me/5511994585257?text=${encodeURIComponent(service ? `Olá, Apollo! Gostaria de saber mais sobre ${service} e solicitar um orçamento para meu veículo.` : "Olá, Apollo! Gostaria de saber mais sobre os serviços e agendar uma avaliação do meu veículo.")}`;
const services = [
  { name: "Lavagem detalhada", category: "Limpeza", icon: Droplets, image: hero, description: "Muito além de uma lavagem. Atenção à carroceria, rodas e aos pequenos detalhes que fazem toda a diferença.", details: ["Limpeza cuidadosa da carroceria", "Atenção a rodas e acabamentos", "Finalização e cuidado com os detalhes"] },
  { name: "Polimento técnico", category: "Proteção", icon: Sparkles, image: polishing, description: "Um novo olhar para a pintura. Tratamento para reduzir imperfeições e valorizar o brilho do seu veículo.", details: ["Avaliação das condições da pintura", "Correção de imperfeições superficiais", "Refinamento de brilho e acabamento"] },
  { name: "Higienização interna", category: "Limpeza", icon: Wind, image: interior, description: "Cuidado de dentro para fora. Limpeza dos materiais e superfícies para um interior mais agradável.", details: ["Limpeza de bancos e estofados", "Cuidado com painéis e superfícies", "Tratamento adequado a cada material"] },
  { name: "Vitrificação", category: "Proteção", icon: ShieldCheck, image: hero, description: "Proteção para a pintura e um acabamento que se destaca. Um cuidado pensado para preservar seu carro.", details: ["Preparação e descontaminação da pintura", "Aplicação de proteção cerâmica", "Orientações de manutenção e cuidados"] },
  { name: "Hidratação de couro", category: "Limpeza", icon: Gem, image: interior, description: "Preserve o toque e a aparência do couro com limpeza e condicionamento específicos para o material.", details: ["Avaliação do estado do couro", "Limpeza com produtos adequados", "Condicionamento e acabamento"] },
  { name: "Proteção de pintura", category: "Proteção", icon: CircleCheck, image: polishing, description: "O cuidado certo para a sua rotina. Conheça as opções de proteção e encontre a ideal para seu veículo.", details: ["Avaliação das necessidades do veículo", "Opções de selagem e proteção", "Cuidados para preservar o acabamento"] },
];
const questions = [
  ["Como faço para agendar um serviço?", "Fale com a Apollo pelo WhatsApp. Informe o modelo do veículo e o cuidado que procura para consultar a disponibilidade e combinar a avaliação."],
  ["Qual é o valor dos serviços?", "O orçamento depende do porte do veículo, das condições atuais e do tratamento escolhido. Entre em contato para solicitar uma avaliação personalizada, sem valores genéricos."],
  ["Quanto tempo leva o atendimento?", "O prazo varia conforme o serviço e as condições do veículo. A equipe informa a previsão de entrega durante o orçamento, antes de confirmar o atendimento."],
  ["Qual a diferença entre polimento e vitrificação?", "O polimento trabalha o acabamento da pintura, reduzindo imperfeições superficiais. A vitrificação acrescenta uma camada de proteção cerâmica. A indicação depende de uma avaliação do veículo."],
];

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({ meta: [
    { title: "Apollo Estética Automotiva | Cuidado em cada detalhe" },
    { name: "description", content: "Conheça a Apollo Estética Automotiva. Cuidado, brilho e proteção para seu veículo. Fale pelo WhatsApp (11) 99458-5257 e solicite uma avaliação." },
    { property: "og:title", content: "Apollo Estética Automotiva" },
    { property: "og:description", content: "Seu carro merece um cuidado extraordinário. Conheça a Apollo e solicite uma avaliação pelo WhatsApp." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "/" },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: "/" }] }),
});

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("Todos");
  const [selected, setSelected] = useState<(typeof services)[number] | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [closing, setClosing] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const closingRef = useRef(false);
  const closeTimer = useRef<number | undefined>(undefined);
  const openService = (service: (typeof services)[number], event: MouseEvent<HTMLElement>) => {
    window.clearTimeout(closeTimer.current);
    closingRef.current = false;
    const rect = event.currentTarget.getBoundingClientRect();
    setOrigin({ x: rect.left + rect.width / 2 - window.innerWidth / 2, y: rect.top + rect.height / 2 - window.innerHeight / 2 });
    setClosing(false);
    setSelected(service);
  };
  const closeService = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    closeTimer.current = window.setTimeout(() => { setSelected(null); setClosing(false); closingRef.current = false; }, 280);
  };
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [filter]);
  useEffect(() => {
    if (!selected) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handler = (event: KeyboardEvent) => { if (event.key === "Escape") closeService(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = previous; window.removeEventListener("keydown", handler); };
  }, [selected]);
  return <div className="apollo-site">
    <header className="site-header">
      <a href="#inicio" className="brand" aria-label="Apollo — início"><img src={logo.url} width={150} height={150} alt="Apollo Estética Automotiva" /></a>
      <nav className={menuOpen ? "main-nav mobile-open" : "main-nav"} aria-label="Navegação principal">
        {[["Início", "inicio"], ["Serviços", "servicos"], ["A Apollo", "apollo"], ["Galeria", "galeria"], ["Contato", "contato"]].map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
      </nav>
      <div className="header-actions"><a className="social-link" href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da Apollo"><Instagram size={19} /></a><Button asChild className="header-cta"><a href={whatsapp()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Agende seu cuidado <ArrowUpRight /></a></Button><Button variant="ghost" size="icon" className="mobile-menu" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
    </header>
    <main>
      <section id="inicio" className="hero">
        <img className="hero-image" src={hero} width={1920} height={1088} alt="Carro esportivo preto com acabamento brilhante sob iluminação azul" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-content content-width">
          <div className="eyebrow"><span /> A EXCELÊNCIA ESTÁ NOS DETALHES</div>
          <h1>APOLLO<span>ESTÉTICA AUTOMOTIVA</span></h1>
          <h2>Não é só um carro.<br />É a sua <em>paixão.</em></h2>
          <p>Cuidado que você sente. Brilho que você vê.<br className="desktop-break" /> Um novo nível de atenção para o seu veículo.</p>
          <div className="hero-buttons"><Button asChild size="lg"><a href={whatsapp()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Solicitar orçamento <ArrowUpRight /></a></Button><Button asChild variant="outline" size="lg"><a href="#servicos">Explore os serviços <ArrowDown /></a></Button></div>
          <div className="hero-note"><ShieldCheck size={16} /><span>Seu veículo, cuidado em cada detalhe.</span></div>
        </div>
        <a className="hero-scroll" href="#servicos"><span>DESCUBRA A APOLLO</span><ArrowDown size={16} /></a>
        <span className="hero-caption">BRILHO. PROTEÇÃO. PERSONALIDADE.</span>
      </section>
      <div className="quality-strip"><div className="content-width">{[[ShieldCheck, "PROTEÇÃO QUE VALORIZA"], [Sparkles, "ATENÇÃO AOS DETALHES"], [Gem, "ACABAMENTO IMPECÁVEL"], [Droplets, "CUIDADO DE DENTRO PARA FORA"]].map(([Icon, text]) => { const ItemIcon = Icon as typeof ShieldCheck; return <div key={String(text)}><ItemIcon size={22} /><span>{String(text)}</span></div>; })}</div></div>
      <section id="servicos" className="section content-width">
        <div className="section-heading reveal"><div><span className="eyebrow">1 / NOSSOS SERVIÇOS</span><h2>O cuidado certo.<br /><span>Em todos os detalhes.</span></h2></div><p>Da limpeza à proteção, cada etapa é pensada<br className="desktop-break" /> para valorizar o que torna seu carro único.</p></div>
        <div className="service-toolbar"><div className="filter-tabs" role="group" aria-label="Filtrar serviços">{["Todos", "Limpeza", "Proteção"].map(item => <Button key={item} variant="ghost" aria-pressed={filter === item} className={filter === item ? "filter-tab active" : "filter-tab"} onClick={() => setFilter(item)}>{item}{item === "Todos" && <span>06</span>}</Button>)}</div><span className="toolbar-note">CUIDADO FEITO PARA O SEU VEÍCULO</span></div>
        <div className="services-grid">{services.filter(s => filter === "Todos" || s.category === filter).map(service => <article className="service-card reveal" key={service.name}><div className="service-image"><img src={service.image} width={1200} height={800} loading="lazy" alt={`Imagem ilustrativa de ${service.name.toLowerCase()}`} /><span className="service-icon"><service.icon size={21} /></span><span className="image-category">{service.category}</span></div><div className="service-body"><h3>{service.name}</h3><p>{service.description}</p><Button variant="link" className="service-link" onClick={event => openService(service, event)}>Conhecer o serviço <ArrowUpRight /></Button></div></article>)}</div>
        <div className="services-bottom"><span>Não sabe qual cuidado seu carro precisa?</span><a href={whatsapp()} target="_blank" rel="noopener noreferrer">Vamos conversar <ArrowRight size={17} /></a></div>
      </section>
      <section id="apollo" className="about-section"><div className="content-width about-grid"><div className="about-photo reveal"><img src={polishing} width={1200} height={800} loading="lazy" alt="Polimento cuidadoso na pintura de um veículo" /><div className="photo-caption"><Sparkles size={24} /><span>PAIXÃO PELO QUE FAZEMOS.<br /><strong>Precisão em cada movimento.</strong></span></div></div><div className="about-copy reveal"><span className="eyebrow">2 / A ESSÊNCIA APOLLO</span><h2>Para quem vê<br />mais que <span>um carro.</span></h2><p>Um carro guarda histórias, acompanha conquistas e reflete a sua personalidade. É por isso que cuidar dele vai muito além da aparência.</p><p>A Apollo Estética Automotiva nasce dessa paixão. Nosso propósito é valorizar cada detalhe do seu veículo, com atenção, critério e respeito pelo que ele representa para você.</p><div className="about-values">{["Atenção individual ao seu veículo", "Cuidado com cada material e acabamento", "Conversa transparente, do início ao fim"].map(value => <div key={value}><Check size={17} />{value}</div>)}</div><Button asChild variant="outline" size="lg"><a href={whatsapp()} target="_blank" rel="noopener noreferrer">Conheça a Apollo <ArrowUpRight /></a></Button></div></div></section>
      <section className="section content-width process-section"><div className="section-heading reveal"><div><span className="eyebrow">3 / A EXPERIÊNCIA</span><h2>Seu próximo brilho<br /><span>começa aqui.</span></h2></div><p>Uma experiência simples.<br />Um cuidado que faz a diferença.</p></div><div className="process-grid">{[["1", "Vamos conversar", "Conte o que você procura e fale com a gente pelo WhatsApp."], ["2", "Olhar para cada detalhe", "Avaliamos seu veículo para indicar os cuidados adequados."], ["3", "Cuidado em ação", "Alinhamos o serviço, o orçamento e o melhor dia para você."], ["4", "Pronto para a próxima", "Seu carro recebe atenção. Você segue com a sua paixão."]].map(([number, title, text]) => <div className="process-step reveal" key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div></section>
      <section id="galeria" className="gallery-section"><div className="content-width"><div className="section-heading reveal"><div><span className="eyebrow">4 / NOSSA INSPIRAÇÃO</span><h2>Detalhes que<br /><span>roubam a cena.</span></h2></div><Button asChild variant="outline"><a href={instagram} target="_blank" rel="noopener noreferrer"><Instagram /> Acompanhe no Instagram <ArrowUpRight /></a></Button></div><div className="gallery-grid reveal"><figure><img src={hero} width={1920} height={1088} loading="lazy" alt="Inspiração de brilho e proteção na pintura preta" /><figcaption><span>01 / EXTERIOR</span>Brilho em sua melhor forma.</figcaption></figure><figure><img src={interior} width={1200} height={800} loading="lazy" alt="Inspiração de acabamento em bancos de couro" /><figcaption><span>02 / INTERIOR</span>Beleza de dentro para fora.</figcaption></figure><figure><img src={polishing} width={1200} height={800} loading="lazy" alt="Detalhe de uma máquina de polimento" /><figcaption><span>03 / DETALHES</span>A diferença está no cuidado.</figcaption></figure></div><p className="gallery-disclaimer">Imagens ilustrativas. Conheça os trabalhos da Apollo no Instagram.</p></div></section>
      <section className="section content-width faq-section"><div className="reveal"><span className="eyebrow">5 / SUAS DÚVIDAS</span><h2>Antes do<br /><span>próximo cuidado.</span></h2><p>Não encontrou a sua resposta?</p><a href={whatsapp()} target="_blank" rel="noopener noreferrer">Fale com a gente <ArrowUpRight size={18} /></a></div><div className="faq-list reveal">{questions.map(([q, a], index) => <div className="faq-item" key={q}><Button variant="ghost" className="faq-trigger" aria-expanded={openFaq === index} aria-controls={`faq-${index}`} onClick={() => setOpenFaq(openFaq === index ? null : index)}>{q}<ChevronDown className={openFaq === index ? "rotated" : ""} /></Button><div id={`faq-${index}`} hidden={openFaq !== index}><p>{a}</p></div></div>)}</div></section>
      <section id="contato" className="contact-section"><div className="contact-line" /><div className="content-width contact-inner reveal"><span className="eyebrow">SEU CARRO MERECE ESSE CUIDADO</span><h2>Vamos dar o próximo<br /><span>brilho à sua história?</span></h2><p>Fale com a Apollo e descubra o cuidado ideal para seu veículo.</p><Button asChild size="lg"><a href={whatsapp()} target="_blank" rel="noopener noreferrer"><MessageCircle /> Falar pelo WhatsApp <ArrowUpRight /></a></Button><a className="phone-link" href="tel:+5511994585257">+55 11 99458-5257</a></div></section>
    </main>
    <footer className="site-footer content-width"><div className="footer-top"><a href="#inicio" className="footer-brand"><img src={logo.url} width={150} height={150} loading="lazy" alt="Apollo Estética Automotiva" /></a><p>Cuidado que você sente.<br />Brilho que você vê.</p><div><a href={instagram} target="_blank" rel="noopener noreferrer"><Instagram size={19} /> Instagram <ArrowUpRight size={16} /></a><a href={whatsapp()} target="_blank" rel="noopener noreferrer"><MessageCircle size={19} /> WhatsApp <ArrowUpRight size={16} /></a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Apollo Estética Automotiva.</span><span>FEITO PARA QUEM É APAIXONADO POR CARROS.</span><a href="#inicio">Voltar ao topo <ArrowUpRight size={14} /></a></div></footer>
    <Button asChild className="floating-whatsapp" size="icon"><a href={whatsapp()} target="_blank" rel="noopener noreferrer" aria-label="Conversar com a Apollo pelo WhatsApp"><MessageCircle size={25} /></a></Button>
    {selected && <div className={closing ? "modal-overlay is-closing" : "modal-overlay"} onClick={closeService}><div className={closing ? "service-modal is-closing" : "service-modal"} style={{ "--from-x": `${origin.x * 0.18}px`, "--from-y": `${origin.y * 0.18}px` } as CSSProperties} role="dialog" aria-modal="true" aria-label={selected.name} onClick={event => event.stopPropagation()}><Button variant="secondary" size="icon" className="modal-close" autoFocus aria-label="Fechar detalhes" onClick={closeService}><X /></Button><div className="modal-media"><img src={selected.image} width={1200} height={800} alt={`Imagem ilustrativa de ${selected.name}`} /></div><div className="modal-body"><span className="eyebrow">CUIDADO APOLLO / {selected.category.toUpperCase()}</span><h2>{selected.name}</h2><p>{selected.description}</p><ul>{selected.details.map(detail => <li key={detail}><Check size={16} />{detail}</li>)}</ul><p className="modal-note">Consulte a disponibilidade e a indicação do tratamento para seu veículo com a equipe Apollo.</p><Button asChild size="lg"><a href={whatsapp(selected.name)} target="_blank" rel="noopener noreferrer"><MessageCircle /> Solicitar orçamento <ArrowUpRight /></a></Button></div></div></div>}
  </div>;
}
