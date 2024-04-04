import React, { useCallback, useState} from 'react';
import logo from './logo.svg';
import juliette from './media/juliette.jpg';
import fashionShow from './media/fashionShow.mov';
import './App.css';

function cx(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const DATA = [
  {
    clue: 'Where Juliet gave her first live performance',
    expectedAnswer: '6969',
    media: juliette,
    mediaType: 'image',
    memory: "It was a great show, but the real show was the friends we made along the way",
  },
  {
    clue: 'Ready for a nap?',
    expectedAnswer: '0420',
    media: fashionShow,
    mediaType: 'video',
    memory: "It was a great show, but the real show was the friends we made along the way",
    nextClue: "It's the final countdown, we're leaving forever!",
  },

]

function AnswerBox({ setAnswer, showError }: { setAnswer: Function, showError: boolean }) {
  const submitForm = useCallback((e: any) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const answer = formData.get('answer');
    setAnswer(answer);
  }, [setAnswer]);
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
    <div className="flex flex-col items-center">
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

function DumbPage({ clue, media, mediaType, memory, answer, answered, setAnswer, nextPage }: any) {
  return (
    <div className="flex flex-col items-center ml-4 mr-4">
      <div className="text-xl font-bold text-center">{clue}</div>
      {answered && (
        <div className="flex flex-col items-center gap-4 mt-4">
          {mediaType =='image' && (
            <img
              src={media}
              className="h-64 w-64"
            ></img>
          )}
          {mediaType =='video' && (
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
          setAnswer={setAnswer}
          showError={!answered && answer !== ''}
        />
      )}
    </div>
  );
}

function Page1({ nextPage  }: any) {
  const { clue, media, mediaType, memory, expectedAnswer } = DATA[0];
  const [answer, setAnswer] = useState('');
  const answered = answer === expectedAnswer;

  return (
    <DumbPage
      clue={clue}
      media={media}
      mediaType={mediaType}
      memory={memory}
      answer={answer}
      answered={answered}
      setAnswer={setAnswer}
      nextPage={nextPage}
    />
  );
}

function Page2({ nextPage }: any) {
  const { clue, media, mediaType, memory, expectedAnswer } = DATA[1];
  const [answer, setAnswer] = useState('');
  const answered = answer === expectedAnswer;

  return (
    <DumbPage
      clue={clue}
      media={media}
      mediaType={mediaType}
      memory={memory}
      answer={answer}
      answered={answered}
      setAnswer={setAnswer}
      nextPage={nextPage}
    />
  );
}




function App() {
  const [page, setPage] = useState(0);
  return (
    <div className="flex flex-col items-center mt-32">
      { page === 0 && (
        <Intro nextPage={() => setPage(1)} />
      )}
      {page === 1 && (
        <Page1 nextPage={() => setPage(2)} />
      )}
      {page === 2 && (
        <Page2 nextPage={() => setPage(2)} />
      )}
    </div>
  );
}

export default App;
