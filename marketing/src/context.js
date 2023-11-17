import { createContext, useCallback, useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import OpenAI from 'openai';
import * as dotenv from "dotenv";

dotenv.config();


const stateValues = {
  aiIsLoading: true,
  aiData: []
  };

const contextValues = {
  ...stateValues,
  fetchAI: () => void 0,
};

export const AiContext = createContext(contextValues);

export const AIProvider  = ( {children} ) => {
  const [state, setState] = useState({});
  const { address, isConnected } = useAccount();
  console.log(address);
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API, // defaults to process.env["OPENAI_API_KEY"]
  });


  
  const fetchAIData = useCallback(async () => {
    const res = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Say this is a test' }],
        model: 'gpt-3.5-turbo',
      })
    return res;
    //   return result[0].result.assets.length > 0;
    }, []);

    const fetchAI = useCallback(async () => {
      setState(() => {
      return {
        aiDataIsLoading: true,
      };
    });

    const [aiData]= await Promise.all([fetchAIData()])
    

    setState((prevState) => {
      return {
        ...prevState,
        aiIsLoading: false,
        aiData: aiData
      };
    });
  }, []);

  useEffect(() => {
    fetchAI();
  }, []);

  return(
    <AiContext.Provider
      value={{
        ...state,
        fetchAI,
      }}
    >
      {children}
    </AiContext.Provider>
  );
  
};
