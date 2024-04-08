import React, { useCallback, useState} from 'react';
import { ReactComponent as BaseRabbitIcon } from './rabbit.svg';
import juliette from './media/juliette.jpg';
import fashionShow from './media/fashionShow.mov';
import evilBunny from './media/evil-bunny.jpg';
import './App.css';

function cx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const DATA = {
  'Page1': {
    clue: 'Where Juliet gave her first live performance',
    expectedAnswer: '6969',
    media: juliette,
    mediaType: 'image',
    memory: "It was a great show, but the real show was the friends we made along the way",
  },
  'Page2': {
    clue: 'Ready for a nap?',
    expectedAnswer: '0420',
    media: fashionShow,
    mediaType: 'video',
    memory: "It was a great show, but the real show was the friends we made along the way",
    nextClue: "It's the final countdown, we're leaving forever!",
  },
};

function RabbitIcon(props: any) {
  return <button onClick={props.onClick} disabled={!props.completed}>
    <BaseRabbitIcon
      style={{
        stroke: 'black',
        strokeWidth: '0.3pt',
        fill: props.completed ? '#7fbe7f' : '#c5c7c5',
      }}    
      className="h-10 w-10"
    />
  </button>;
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
          type="number"
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
      <h1 className="text-2xl font-bold mb-8">Welcome to the treasure hunt!</h1>
      <div className="flex flex-col items-center gap-4 text-base text-center ml-8">
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
              className="h-64 w-64"
            ></img>
          )}
          {mediaType ==='video' && (
            <video className="h-64 w-64" controls autoPlay loop muted>
            <source src={fashionShow} type="video/mp4"></source>
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

function Page1({ nextPage, answer, onAnswer  }: any) {
  const { clue, media, mediaType, memory, expectedAnswer } = DATA['Page1'];
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

function Page2({ nextPage, answer, onAnswer }: any) {
  const { clue, media, mediaType, memory, expectedAnswer } = DATA['Page2'];
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
        <p>But the game is far from over!</p>
        <img alt={evilBunny} src={evilBunny} className="h-64 w-64"></img>
      </div>
    </div>
  );
}

function App() {
  const [answered, setAnswered] = useStickyState([], 'answered');
  const [page1Answer, setPage1Answer] = useState(answered.includes('Page1') ? DATA['Page1'].expectedAnswer: '');
  const [page2Answer, setPage2Answer] = useState(answered.includes('Page2') ? DATA['Page2'].expectedAnswer: '');
  const [currentPage, setCurrentPage] = useState(0);

  const allAnswered = answered.includes('Page1') && 
    answered.includes('Page2');

  return (
    <div className="flex flex-col items-center mt-16">
      <div className="flex flex-row items-center gap-8">
        <RabbitIcon
          completed={answered.includes('Page1')}
          onClick={() => {
            setCurrentPage(1);
          }}
        />
        <RabbitIcon
          completed={answered.includes('Page2')}
          onClick={() => {
            setCurrentPage(2);
          }}
        />
        <RabbitIcon
          completed={allAnswered}
          onClick={() => {
            setCurrentPage(3);
          }}
        />
      </div>
      { currentPage === 0 && (
        <Intro nextPage={() => {
          setCurrentPage(1);
        }} />
      )}
      {currentPage === 1 && (
        <Page1 
          nextPage={() => {
            setCurrentPage(2);
          }}
          answer={page1Answer}
          onAnswer={(answer: string) => {
            if (answer === DATA['Page1'].expectedAnswer) {
              setPage1Answer(answer);
              setAnswered([...answered, 'Page1']);
            }
          }}
        />
      )}
      {currentPage === 2 && (
        <Page2
          nextPage={() => {
            setCurrentPage(3);
          }}
          answer={page2Answer}
          onAnswer={(answer: string) => {
            if (answer === DATA['Page2'].expectedAnswer) {
              setPage2Answer(answer);
              setAnswered([...answered, 'Page2']);
            }
          }}
        />
      )}
      {currentPage === 3 && (
        <LastPage />
      )}
    </div>
  );
}

export default App;
