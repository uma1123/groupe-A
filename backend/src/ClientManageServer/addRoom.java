package ClientManageServer;

    //新規ルームを作成し、リストに追加するメソッド

    public void addRoom(int roomId, int numberOfPeople, int lives) {
        // 新しいRoomインスタンスを生成
        Room newRoom = new Room(roomId, numberOfPeople, lives);

        // リストに追加
        rooms.add(newRoom);

        System.out.println("ルームID: " + roomId + " を作成");
    }



