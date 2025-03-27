import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Створення домашньої сторінки
    const homePageContent = {
      heroTitle: "Духовна подорож до святих місць",
      heroDescription: "Відкрийте для себе глибину духовного досвіду через паломництво з нашим центром",
      missionTitle: "Наша місія",
      missionDescription: "Ми прагнемо зробити паломницькі поїздки доступними для всіх, хто бажає відвідати свята місця. Наш центр організовує безпечні та комфортні подорожі, які дозволяють глибше пізнати духовну спадщину та збагатитися духовно.",
      servicesTitle: "Наші послуги",
      servicesDescription: "Ми пропонуємо повний спектр послуг для забезпечення незабутньої та комфортної подорожі",
      destinationsTitle: "Популярні напрямки",
      destinationsDescription: "Відвідайте святі місця, що надихають мільйони паломників по всьому світу",
      testimonialTitle: "Відгуки паломників",
      ctaTitle: "Готові до духовної подорожі?",
      ctaDescription: "Приєднуйтеся до наших паломницьких поїздок і відкрийте для себе глибину духовного досвіду"
    };

    await prisma.page.upsert({
      where: { slug: 'home' },
      update: {
        content: JSON.stringify(homePageContent),
        title: 'Головна сторінка',
        metaTitle: 'Паломницький центр - Духовні подорожі до святих місць',
        metaDescription: 'Організовуємо паломницькі поїздки до святих місць по всьому світу. Духовний супровід, комфортні умови, незабутні враження.'
      },
      create: {
        slug: 'home',
        title: 'Головна сторінка',
        content: JSON.stringify(homePageContent),
        metaTitle: 'Паломницький центр - Духовні подорожі до святих місць',
        metaDescription: 'Організовуємо паломницькі поїздки до святих місць по всьому світу. Духовний супровід, комфортні умови, незабутні враження.',
        isSystem: true
      }
    });

    // Створення тестових відгуків
    const testimonials = [
      {
        name: "Марія Петренко",
        image: "https://randomuser.me/api/portraits/women/17.jpg",
        text: "Паломництво до Святої Землі назавжди змінило моє життя. Завдяки професійній організації та духовному супроводу я змогла повністю зануритися у цю неповторну подорож."
      },
      {
        name: "Іван Ковальчук",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        text: "Це була моя перша поїздка на Афон. Дякуючи команді центру, все пройшло ідеально, від оформлення документів до духовного супроводу."
      },
      {
        name: "Олена Савченко",
        image: "https://randomuser.me/api/portraits/women/54.jpg",
        text: "Дуже вдячна за чудову організацію подорожі та глибоке духовне наповнення. Обов'язково поїду ще раз!"
      }
    ];

    // Видаляємо старі відгуки перед створенням нових
    await prisma.testimonial.deleteMany({});

    // Створюємо нові відгуки
    for (const testimonial of testimonials) {
      await prisma.testimonial.create({
        data: testimonial
      });
    }

    // Створення тестових подій
    const events = [
      {
        title: 'Паломництво до Святої Гори Афон',
        description: 'Духовна подорож до одного з найсвятіших місць православного світу. Відвідування монастирів і скитів, участь у богослужіннях.',
        startDate: new Date('2024-06-15'),
        endDate: new Date('2024-06-25'),
        location: 'Греція, Афон',
        price: 25000,
        image: 'https://images.unsplash.com/photo-1607325294707-11329f84c363?q=80&w=1974&auto=format&fit=crop',
        status: 'upcoming',
        difficulty: 'середня',
        includes: ['Проживання', 'Харчування', 'Трансфер', 'Духовний супровід'],
        maxParticipants: 20,
        currentParticipants: 12
      },
      {
        title: 'Паломництво до Святої Землі',
        description: 'Відвідування святих місць, пов\'язаних з життям Ісуса Христа. Єрусалим, Віфлеєм, Назарет та інші святі міста.',
        startDate: new Date('2024-07-10'),
        endDate: new Date('2024-07-20'),
        location: 'Ізраїль, Палестина',
        price: 32000,
        image: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=2070&auto=format&fit=crop',
        status: 'upcoming',
        difficulty: 'легка',
        includes: ['Проживання', 'Харчування', 'Авіапереліт', 'Трансфер', 'Духовний супровід'],
        maxParticipants: 25,
        currentParticipants: 15
      },
      {
        title: 'Паломництво до Почаївської лаври',
        description: 'Відвідування однієї з найбільших православних святинь України. Духовні бесіди та богослужіння.',
        startDate: new Date('2024-05-05'),
        endDate: new Date('2024-05-08'),
        location: 'Україна, Почаїв',
        price: 3500,
        image: 'https://images.unsplash.com/photo-1520516415634-947297ba99ff?q=80&w=1944&auto=format&fit=crop',
        status: 'upcoming',
        difficulty: 'легка',
        includes: ['Проживання', 'Харчування', 'Трансфер', 'Духовний супровід'],
        maxParticipants: 40,
        currentParticipants: 28
      },
      {
        title: 'Паломництво до Києво-Печерської лаври',
        description: 'Відвідування однієї з найдавніших та найшанованіших православних святинь України. Екскурсія печерами з мощами святих.',
        startDate: new Date('2024-04-12'),
        endDate: new Date('2024-04-14'),
        location: 'Україна, Київ',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1554629904-0b3cc8ed4051?q=80&w=2036&auto=format&fit=crop',
        status: 'past',
        difficulty: 'легка',
        includes: ['Проживання', 'Харчування', 'Екскурсії', 'Духовний супровід'],
        maxParticipants: 30,
        currentParticipants: 30
      }
    ];

    // Видаляємо старі події перед створенням нових
    await prisma.event.deleteMany({});

    // Створюємо нові події
    for (const event of events) {
      await prisma.event.create({
        data: event
      });
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
} 