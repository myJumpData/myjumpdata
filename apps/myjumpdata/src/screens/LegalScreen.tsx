import { useState } from 'react';
import undraw_terms from '../assets/undraw_terms_re_6ak4.svg';
import Wrapper from '../parts/Wrapper';
import { TermsSection, TermsText } from './TermsScreen';

export default function LegalScreen() {
  const [message, setMessage] = useState<null | string>(null);
  return (
    <Wrapper
      current="legal"
      type="main"
      text={message}
      state={(e) => setMessage(e)}
    >
      <Jumbotron />
      <Main />
    </Wrapper>
  );

  function Jumbotron() {
    return (
      <div className="container px-3 mx-auto flex flex-wrap flex-col md:flex-row items-center">
        <div className="flex flex-col w-full md:w-3/5 justify-center items-start text-center md:text-left">
          <p className="tracking-loose w-full">Trust & Legal</p>
          <h1 className="my-4 lg:text-4xl text-2xl font-bold leading-tight w-full">
            Legal Notice
          </h1>
        </div>
        <div className="text-center w-full md:w-2/5">
          <img src={undraw_terms} alt="Terms" />
        </div>
      </div>
    );
  }

  function Main() {
    return (
      <div>
        <TermsSection heading="Information according to § 5 TMG">
          <TermsText>
            Marko Fediv
            <br />
            Cranachstr. 12i
            <br />
            63452 Hanau
          </TermsText>
        </TermsSection>
        <TermsSection heading="Contact">
          <TermsText>
            Phone: <a href="tel:017682763899">017682763899</a>
            <br />
            Email:{' '}
            <a href="mailto:marko.fediv@gmail.com">marko.fediv@gmail.com</a>
          </TermsText>
        </TermsSection>
      </div>
    );
  }
}
