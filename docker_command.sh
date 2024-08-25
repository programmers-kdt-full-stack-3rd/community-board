if [ $1 == "build" ]; then
    sudo docker build -t hungkunge/community_board -f ./Dockerfile .
elif [ $1 == "push" ]; then
  docker push hungkunge/community_board;
elif [ $1 == "pull" ]; then
  sudo docker pull hungkunge/community_board;
elif [ $1 == "run" ]; then
  sudo docker run -d -p 9000:9000 -p 3000:3000 hungkunge/community_board;
else
  echo "wrong command!";
fi