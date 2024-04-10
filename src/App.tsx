import React, { useCallback, useState} from 'react';
import { ReactComponent as BaseRabbitIcon } from './rabbit.svg';
import inLovingMemory from './media/in-loving-memory.jpg';
import juliette from './media/juliette.jpg';
import toby from './media/toby.jpg';
import poolTable from './media/poolTable.jpg';
import spikeball from './media/spikeball.jpg';
import thatsAChoppin from './media/thats-a-choppin.jpg';
import washingUp from './media/washing-up.mov';
import toilet from './media/toilet.jpg';
import fashionShow from './media/fashionShow.mov';
import ducks from './media/ducks.png';
import evilBunny from './media/evil-bunny.jpg';
import './App.css';

interface PageData {
  clue: string;
  location: string;
  expectedAnswer: string;
  media: any;
  mediaType: "image" | "video";
  memory: string;
}

function cx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}


const DATA: { [key: string]: PageData} = {
  'Page1': {
    clue: "You'll soon be a visitor in the office, but I think you're familiar with the process when you arrive",
    location: 'The sign in iPad at reception',
    expectedAnswer: '0000',
    media: spikeball,
    mediaType: 'image',
    memory: "Spikeball in floor 1 of GES",
  },
  'Page2': {
    clue: 'Where Juliet gave her first live performance',
    location: "the lectern in woolamaloo",
    expectedAnswer: '6969',
    media: toilet,
    mediaType: 'image',
    memory: "It was a good performance, but Pranava got the real show in the ladies room afterwards",
  },
  'Page3': {
    clue: "Do you believe...? You'll need something to sign with",
    location: 'floor 9 stationary cupboard',
    expectedAnswer: '8008',
    media: toby,
    mediaType: 'image',
    memory: '...in love after love?',
  },
  'Page4': {
    clue: "The final countdown... We're leaving forever...",
    location: "underneath Davy's desk",
    expectedAnswer: '4321',
    media: juliette,
    mediaType: 'image',
    memory: '2024 EOY ROAST!',
  },
  'Page5': {
    clue: 'Time to join Liz for a game of Splendor',
    location: 'Marrickville',
    expectedAnswer: 'ruby',
    media: ducks,
    mediaType: 'image',
    memory: 'Run out of fucks? No problem, just sub in some ducks!',
  },
  'Page6': {
    clue: "A spicy meeting is happening in redfern, let's listen in...",
    location: 'The wellness room',
    expectedAnswer: '0420',
    media: '',
    mediaType: 'image',
    memory: '',
  },
  'Page7': {
    clue: "I'm board... let's play a game",
    location: 'the board games shelf outside the kitchen',
    expectedAnswer: '1001',
    media: fashionShow,
    mediaType: 'video',
    memory: 'And Amir never asked Adam for another favour, ever again.',
  },
  'Page8': {
    clue: 'Not quite the corner pocket',
    location: 'the pool table',
    expectedAnswer: '8888',
    media: poolTable,
    mediaType: 'image',
    memory: "It's 13:34, is that home time, or pool time",
  },
  'Page9': {
    clue: 'Getting hungry? Time for a snack!',
    location: 'the snack shelf',
    expectedAnswer: 'nuts',
    media: thatsAChoppin,
    mediaType: 'image',
    memory: 'deez nuts',
  },
  'Page10': {
    clue: "We've gotten a bit dirty... time to clean up",
    location: "Near the sink in the kitchen",
    expectedAnswer: 'soap',
    media: washingUp,
    mediaType: 'video',
    memory: "It's not that hard... IS WHAT SHE SAID!",
  },
};

function RabbitIcon(props: any) {
  return (
    <button 
      onClick={props.onClick}
      disabled={!props.completed}
      className="border-solid border-1 shadow-md border-grey-50 rounded-full p-1"
    >
      <BaseRabbitIcon
        style={{
          stroke: 'black',
          strokeWidth: '0.3pt',
          fill: props.completed ? '#7fbe7f' : '#c5c7c5',
        }}    
        className="h-8 w-8"
      />
    </button>
  );
};

function useStickyState(defaultValue: any, key: string) {
  const [value, setValue] = React.useState(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function AnswerBox({ onAnswer, showError }: { onAnswer: Function, showError: boolean }) {
  const submitForm = useCallback((e: any) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const answer = formData.get('answer');
    onAnswer(answer);
  }, [onAnswer]);
  return (
    <div>
      <form onSubmit={submitForm}>
        <input
          name="answer"
          className={cx("border p-2 rounded-lg mt-8", showError ? "border-red-500": "border-gray-300" )}
          placeholder="Look under your rabbit"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-lg mt-8"
        >
          Submit
        </button>
        { showError && (
          <p className="text-red-500 text-xs font-light">Nope, try again!</p>
        )}
      </form>
    </div>
  );
}


function NextClueButton({ nextPage }: { nextPage: Function }) {
  return (
    <button
      className="bg-blue-500 text-white p-2 rounded-lg mt-8"
      onClick={(e: any) => {
        e.preventDefault();
        nextPage();
      }}
    >
      Next Clue
    </button>
  );
}

function Intro({ nextPage }: { nextPage: Function }) {
  return (
    <div className="flex flex-col items-center mt-8">
      <img alt="In loving memory" src={inLovingMemory} className="w-64"></img>
      <h1 className="text-2xl font-bold mb-8">Welcome to the treasure hunt!</h1>
      <div className="flex flex-col items-center gap-4 text-base text-center">
        <p>We've hidden rabbits throughout the office.</p>
        <p>Each rabbit has a code for you that you can enter here to get your next clue.</p>
        <p>There's a <span className="font-semibold">big surprise</span> waiting for you at the end!</p>
      </div>
      <NextClueButton nextPage={nextPage} />
    </div>
  );
}

function DumbPage({ clue, media, mediaType, memory, answer, answered, onAnswer, nextPage }: any) {
  return (
    <div className="flex flex-col items-center ml-4 mr-4 mt-8">
      <div className="text-xl font-bold text-center">{clue}</div>
      {answered && (
        <div className="flex flex-col items-center gap-4 mt-4">
          {mediaType ==='image' && (
            <img
              alt={clue}
              src={media}
              className="w-64"
            ></img>
          )}
          {mediaType ==='video' && (
            <video className="w-64" controls autoPlay loop muted>
            <source src={media} type="video/mp4"></source>
          </video>
          )}
          <p className="text-center">{memory}</p>
          <NextClueButton nextPage={nextPage} />
        </div>
      )}
      {!answered && (
        <AnswerBox
          onAnswer={onAnswer}
          showError={!answered && answer !== ''}
        />
      )}
    </div>
  );
}

interface SmartPageProps {
  currentPage: string;
  nextPage: Function;
  answer: string;
  onAnswer: Function;
}

function SmartPage({ currentPage, nextPage, answer, onAnswer  }: SmartPageProps) {
  const { clue, media, mediaType, memory, expectedAnswer } = DATA[currentPage];
  const answered = answer === expectedAnswer;

  return (
    <DumbPage
      clue={clue}
      media={media}
      mediaType={mediaType}
      memory={memory}
      answer={answer}
      answered={answered}
      onAnswer={onAnswer}
      nextPage={nextPage}
    />
  );
}

function LastPage() {
  return (
    <div className="flex flex-col items-center mt-8">
      <h1 className="text-2xl font-bold mb-8">That was the last rabbit!</h1>
      <div className="flex flex-col items-center gap-4 text-base text-center ml-8">
        <p>But the game is far from over...</p>
        <img alt={evilBunny} src={evilBunny} className="h-64 w-64"></img>
      </div>
    </div>
  );
}

function initialAnswersState(answered: string[] = []): {[key: string]: string} {
  return {
    'Page1': answered.includes('Page1') ? DATA['Page1'].expectedAnswer: '',
    'Page2': answered.includes('Page2') ? DATA['Page2'].expectedAnswer: '',
    'Page3': answered.includes('Page3') ? DATA['Page3'].expectedAnswer: '',
    'Page4': answered.includes('Page4') ? DATA['Page4'].expectedAnswer: '',
    'Page5': answered.includes('Page5') ? DATA['Page5'].expectedAnswer: '',
    'Page6': answered.includes('Page6') ? DATA['Page6'].expectedAnswer: '',
    'Page7': answered.includes('Page7') ? DATA['Page7'].expectedAnswer: '',
    'Page8': answered.includes('Page8') ? DATA['Page8'].expectedAnswer: '',
    'Page9': answered.includes('Page9') ? DATA['Page9'].expectedAnswer: '',
    'Page10': answered.includes('Page10') ? DATA['Page10'].expectedAnswer: '',
  };
}

function App() {
  const [answered, setAnswered] = useStickyState([], 'answered');
  const [pageAnswers, setPageAnswers] = useState(initialAnswersState(answered));
  const numAnswered = answered.length;
  const [currentPage, setCurrentPage] = useState(numAnswered > 0 ? answered[numAnswered-1] : 'intro');

  const allAnswered = new Set(answered).size === 10; 
  const pages = Array.from({ length: 10 }, (_, i) => `Page${i + 1}`);


  return (
    <div className="flex flex-col items-center mt-16 ml-4 mr-4 gap-1">
      <div className="flex flex-row flex-wrap items-center gap-2">
        {pages.slice(0,6).map((page) => (
          <RabbitIcon
            completed={answered.includes(page)}
            onClick={() => {
              setCurrentPage(page);
            }}
          />
        ))}
      </div>
      <div className="flex flex-row flex-wrap items-center gap-2">
        {pages.slice(6).map((page) => (
          <RabbitIcon
            completed={answered.includes(page)}
            onClick={() => {
              setCurrentPage(page);
            }}
          />
        ))}
        <RabbitIcon
          completed={allAnswered}
          onClick={() => {
            setCurrentPage('last');
          }}
        />
      </div>
      { currentPage === 'intro' && (
        <Intro nextPage={() => {
          setCurrentPage('Page1');
        }} />
      )}
      {pages.includes(currentPage) && (
        <SmartPage
          currentPage={currentPage}
          nextPage={() => {
            const currentPageIndex = pages.indexOf(currentPage);
            if (currentPageIndex < pages.length - 1) {
              setCurrentPage(pages[currentPageIndex + 1]);
            } else {
              setCurrentPage('last');
            }
          }}
          answer={pageAnswers[currentPage]}
          onAnswer={(answer: string) => {
            setPageAnswers(Object.assign({}, pageAnswers, { [currentPage]: answer }));
            if (answer === DATA[currentPage].expectedAnswer) {
              setAnswered([...answered, currentPage]);
            }
          }}
        />
      )}
      {currentPage === 'last' && (
        <LastPage />
      )}
    </div>
  );
}

export default App;
